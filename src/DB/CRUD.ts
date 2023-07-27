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
import { createCache } from "./cache";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

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
  read(
    filters?: Array<Filter<EntitiesMapDB[N]>>,
    limit?: number,
    skip?: number
  ): Promise<Array<EntitiesMapDB[N]>>;

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

export const getCRUD = <N extends keyof EntitiesMapDB>(
  collectionName: N
): CRUD<N> => {
  const collection = getCollection(collectionName);
  const cache = createCache<EntitiesMapDB[N][]>();
  const errorBuilder = getEntityErrorBuilder(collectionName);

  const createCacheKey = (
    filters: Filter<EntitiesMapDB[N]>[],
    limit: number,
    offset: number = 0
  ) => JSON.stringify({ filters, skip: offset, limit });

  const createCacheKeyById = (id: IdType) =>
    createCacheKey([{ [idKey]: id }], 1);

  const isIdExists = async (id: IdType): Promise<boolean> => {
    if (!ObjectId.isValid(id)) return false;
    const result = await collection.findOne({ [idKey]: new ObjectId(id) });
    return !!result;
  };

  const read = async (
    filters: Filter<EntitiesMapDB[N]>[],
    limit: number = env.DEFAULT_PAGE_SIZE,
    skip: number = 0
  ) => {
    const cacheKey = createCacheKey(filters, limit, skip);
    const cached = cache.get(cacheKey);

    logger.verbose(
      `found ${cached?.length} items in cache for key: ${cacheKey}`
    );

    const entitiesFound =
      cached ??
      (await collection
        .aggregate<EntitiesMapDB[N]>([
          ...filters.map((filter) =>
            idKey in filter && ObjectId.isValid(filter[idKey])
              ? { $match: { [idKey]: new ObjectId(filter[idKey]) } }
              : { $match: filter }
          ),
          { $skip: skip },
          { $limit: limit },
        ])
        .toArray());

    cache.set(cacheKey, entitiesFound);

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

    cache.delete(createCacheKeyById(insertedId));

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

    if (result.modifiedCount > 0) cache.delete(createCacheKeyById(id));

    return result.acknowledged;
  };

  const deleteOne = async (id: IdType) => {
    if (!(await isIdExists(id))) throw errorBuilder.notFound(idKey, id);
    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
    logger.verbose(`delete result: ${JSON.stringify(result, null, 4)}`);

    if (result.deletedCount > 0) cache.delete(createCacheKeyById(id));
    return result.acknowledged;
  };

  return {
    create,
    read,
    update,
    delete: deleteOne,
  };
};
