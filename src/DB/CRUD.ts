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
import { getEntityCache } from "../cache/redisCache";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

export type ReadOptions = {
  /**
   * The filters to apply
   * @example
   * ```ts
   * const usersCrud = await getCRUD("users");
   * const usersFound = usersCrud.read([{
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

export interface CRUD<N extends keyof EntitiesMapDB, E = EntitiesMapDB[N]> {
  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or undefined if not created
   */
  create(data: EntitiesMapDBWithoutId[N]): Promise<E>;

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
  read(readOptions: ReadOptions): Promise<Array<E>>;

  /**
   * Gets an entity instance by its id
   * @param id id of the entity instance
   * @returns the entity
   *
   * @example
   * ```ts
   * const idToFind = "59a47286cfa9a3a73e51e72c";
   * const usersCrud = await getCRUD("users");
   * const userFound = await usersCrud.readById(idToFind);
   * console.log(userFound);
   *
   * // Output:
   * // {
   * //   _id: "59a47286cfa9a3a73e51e72c",
   * //   email: 'a12...',
   * //   ...
   * // }
   * ```
   */
  readById(id: IdType): Promise<E>;

  /**
   * Updates an entity instance
   * @param id id of the entity instance
   * @param data data of the entity instance
   * @returns whether the entity instance was updated or not
   */
  update(id: IdType, data: Partial<EntitiesMapDBWithoutId[N]>): Promise<E>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns whether the entity instance was deleted or not
   */
  delete(id: IdType): Promise<E>;
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

  const create = async (data: EntitiesMapDBWithoutId[N]) => {
    const result = await collection.insertOne(data);
    if (!result.acknowledged)
      throw errorBuilder.general("create", "operation failed");

    const insertedId = result.insertedId.toString();

    const cacheKey = createCacheKeyById(insertedId);

    const deletedCountCache = await cache?.delete(cacheKey);

    if (deletedCountCache !== 1)
      logger.warn(
        `Cache: deleted ${deletedCountCache} items from cache instead of 1 in key: ${cacheKey}`
      );

    logger.verbose(`create result: ${JSON.stringify(result, null, 4)}`);

    const entityCreated = await readByIdHelper(insertedId);

    return entityCreated;
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

    logger.debug(
      `found ${cachedResult?.length} items in cache for key: ${cacheKey}`
    );

    const entitiesFound = isThereValidCachedResult
      ? cachedResult
      : await readHelper({
          filters,
          limit,
          offset,
        });

    if (!isThereValidCachedResult) {
      const setCacheResult = await cache?.set(cacheKey, entitiesFound);
      if (!setCacheResult)
        logger.warn(`Cache: failed to set cache for key: ${cacheKey}`);
    }
    if (!entitiesFound.length) {
      throw errorBuilder.notFound("filters", JSON.stringify(filters));
    }

    return entitiesFound;
  };

  const readByIdHelper = async (id: IdType, enableCache = true) => {
    const entityCacheKey = createCacheKeyById(id);

    const cachedResult = enableCache
      ? await cache?.get(entityCacheKey)
      : undefined;

    if (cachedResult) return cachedResult[0];

    if (!ObjectId.isValid(id)) throw errorBuilder.notFound(idKey, id);

    const entity = await collection.findOne<EntitiesMapDB[N]>({
      [idKey]: new ObjectId(id),
    });

    if (!entity) throw errorBuilder.notFound(idKey, id);

    const setCacheResult = await cache?.set(entityCacheKey, [entity]);

    if (!setCacheResult)
      logger.warn(`Cache: failed to set cache for key: ${entityCacheKey}`);

    return entity;
  };

  const readById = async (id: IdType) => {
    const entity = await readByIdHelper(id);

    return entity;
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ) => {
    const entityToUpdate = await readByIdHelper(id);

    const insertionResult = await collection.updateOne(
      { [idKey]: new ObjectId(id) },
      { $set: data }
    );

    if (!insertionResult.acknowledged)
      throw errorBuilder.general("update", "operation failed");

    if (insertionResult.modifiedCount <= 0) return entityToUpdate;

    const updatedEntity = await readByIdHelper(id);

    const entityCacheKey = createCacheKeyById(id);
    const deletedCountCache = await cache?.delete(entityCacheKey);

    if (deletedCountCache !== 1)
      logger.warn(
        `Cache: deleted ${deletedCountCache} items from cache instead of 1 in key: ${entityCacheKey}`
      );

    const setCacheResult = await cache?.set(entityCacheKey, [updatedEntity]);

    if (!setCacheResult)
      logger.warn(`Cache: failed to set cache for key: ${entityCacheKey}`);

    return updatedEntity;
  };

  const deleteOne = async (id: IdType) => {
    const entityToDelete = await readByIdHelper(id, false);

    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
    logger.verbose(`delete result: ${JSON.stringify(result, null, 4)}`);

    if (!result.acknowledged)
      throw errorBuilder.general("delete", "operation failed");

    if (result.deletedCount <= 0)
      throw errorBuilder.general("delete", "nothing was deleted");

    const entityCacheKey = createCacheKeyById(id);
    const deletedCountCache = await cache?.delete(entityCacheKey);

    if (deletedCountCache !== 1)
      logger.warn(
        `Cache: deleted ${deletedCountCache} items from cache instead of 1 in key: ${entityCacheKey}`
      );

    return entityToDelete;
  };

  return {
    create,
    read,
    readById,
    update,
    delete: deleteOne,
  };
};
