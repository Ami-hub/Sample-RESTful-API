import { ObjectId } from "mongodb";
import {
  EntitiesMapDB,
  EntitiesMapDBWithoutId,
  IdType,
  idKey,
  Filter,
} from "../types/general";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";
import { env } from "../setup/env";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import { getEntityCache } from "./redisCache";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

export type ReadOptions = {
  /**
   * The filters to apply
   * @default []
   * @example
   * ```ts
   * const usersFound = await getCRUD("users").read([{
   *   name: "Jane Doe", "email": "jane@female.com",
   * }]);
   * ```
   */
  filters?: Array<Filter<EntitiesMapDB[keyof EntitiesMapDB]>>;

  /**
   * The amount of entities to return
   */
  limit?: number;

  /**
   * The amount of entities to skip
   */
  offset?: number;
};

export interface CRUD<N extends keyof EntitiesMapDB> {
  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or undefined if not created
   */
  create(data: EntitiesMapDBWithoutId[N]): Promise<IdType | undefined>;

  /**
   * Gets all entity instances
   * @param filters filters to apply (intersection between filters)
   * @param limit max amount of entities to return, default is in env
   * @param skip amount of entities to skip, default is 0
   * @returns an array of entity instances
   * @example
   * ```ts
      const usersFound = await getCRUD("users").read([{ 
          key: "email", value: "test@test.com" }], 1);

      console.log(usersFound);

      // Output:
      // [
      //   {
      //     _id: ...,
      //     email: 'test@test.com',
      //     ...
      //   }
      // ]
      ```
    */
  read(readOptions: ReadOptions): Promise<Array<EntitiesMapDB[N]>>;

  /**
   * Updates an entity instance
   * @param id id of the entity instance
   * @param data data of the entity instance
   * @returns whether the entity instance was updated or not
   */
  update(
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ): Promise<boolean>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns whether the entity instance was deleted or not
   */
  delete(id: IdType): Promise<boolean>;
}

// ########################################
//             Implementation
// ########################################

export const getCRUD = async <N extends keyof EntitiesMapDB>(
  collectionName: N
): Promise<CRUD<N>> => {
  const collection = getCollection(collectionName);
  const errorBuilder = getEntityErrorBuilder(collectionName);
  const cache = await getEntityCache(collectionName);

  const createCacheKey = (keys: Required<Omit<ReadOptions, "limit">>) => {
    return JSON.stringify({
      filters: keys.filters,
      offset: keys.offset,
    });
  };

  const createCacheKeyById = (id: IdType) =>
    createCacheKey({
      filters: [{ [idKey]: id }],
      offset: 0,
    });

  const isIdExists = async (id: IdType): Promise<boolean> => {
    if (!ObjectId.isValid(id)) return false;
    const result = await collection.findOne({ [idKey]: new ObjectId(id) });
    return !!result;
  };

  const readHelper = async (readOptions: Required<ReadOptions>) => {
    return await collection
      .aggregate<EntitiesMapDB[N]>([
        ...readOptions.filters.map((filter) =>
          idKey in filter && ObjectId.isValid(filter[idKey])
            ? { $match: { [idKey]: new ObjectId(filter[idKey]) } }
            : { $match: filter }
        ),
        { $skip: readOptions.offset },
        { $limit: readOptions.limit },
      ])
      .toArray();
  };

  const read = async (readOptions: ReadOptions) => {
    const filters = readOptions.filters ?? [];
    const limit = readOptions.limit ?? env.DEFAULT_PAGE_SIZE;
    const offset = readOptions.offset ?? 0;

    const cacheKey = createCacheKey({
      filters,
      offset,
    });

    const cachedResult = await cache?.get(cacheKey);

    const isThereValidCachedResult =
      cachedResult && cachedResult.length >= limit;

    logger.verbose(
      `found ${cachedResult?.length} items in cache for key: ${cacheKey}`
    );

    const entitiesFound = isThereValidCachedResult
      ? cachedResult
      : await readHelper({
          filters,
          limit,
          offset,
        });

    if (!isThereValidCachedResult) await cache?.set(cacheKey, entitiesFound);

    if (!entitiesFound.length) {
      throw filters.length === 1 && idKey in filters[0]
        ? errorBuilder.notFound(idKey, filters[0][idKey])
        : errorBuilder.notFound("filters", JSON.stringify(filters));
    }

    return entitiesFound;
  };

  const create = async (data: EntitiesMapDBWithoutId[N]) => {
    const result = await collection.insertOne(data);
    if (!result.acknowledged) return undefined;
    const insertedId = result.insertedId.toString();

    await cache?.delete(createCacheKeyById(insertedId));

    logger.verbose(`create result: ${JSON.stringify(result, null, 4)}`);
    return insertedId;
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ) => {
    if (!(await isIdExists(id))) throw errorBuilder.notFound(idKey, id);
    const result = await collection.updateOne(
      { [idKey]: new ObjectId(id) },
      { $set: data }
    );
    logger.verbose(`update result: ${JSON.stringify(result, null, 4)}`);

    if (result.modifiedCount > 0) cache?.delete(createCacheKeyById(id));

    return result.acknowledged;
  };

  const deleteOne = async (id: IdType) => {
    if (!(await isIdExists(id))) throw errorBuilder.notFound(idKey, id);
    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
    logger.verbose(`delete result: ${JSON.stringify(result, null, 4)}`);

    if (result.deletedCount > 0) cache?.delete(createCacheKeyById(id));
    return result.acknowledged;
  };

  return {
    create,
    read,
    update,
    delete: deleteOne,
  };
};
