import { Filter, ObjectId } from "mongodb";

import { EntitiesMap, EntitiesMapDBWithoutId } from "../models/entitiesMaps";
import { IdType, idKey } from "../models/id";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";
import { env } from "../setup/env";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";

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
  filters?: Array<Filter<EntitiesMap[keyof EntitiesMap]>>;

  /**
   * The amount of entities to return
   */
  limit?: number;

  /**
   * The amount of entities to skip
   */
  offset?: number;
};

export interface CRUD<N extends keyof EntitiesMap, E = EntitiesMap[N]> {
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
          email: "test@test.com" }], 1);

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

export const getCRUD = <N extends keyof EntitiesMap>(
  collectionName: N
): CRUD<N> => {
  const collection = getCollection(collectionName);
  const errorBuilder = getEntityErrorBuilder(collectionName);

  const create = async (data: EntitiesMapDBWithoutId[N]) => {
    const result = await collection.insertOne(data);

    logger.trace({
      entityName: collectionName,
      method: "create",
      result,
    });

    if (!result.acknowledged)
      throw errorBuilder.general("create", "not acknowledged");

    const insertedId = result.insertedId.toString();

    const entityCreated = await readByIdHelper(insertedId);

    return entityCreated;
  };

  const readHelper = async (readOptions: Required<ReadOptions>) => {
    return await collection
      .aggregate<EntitiesMap[N]>([
        ...readOptions.filters.map((filter) => ({ $match: filter })),
        { $skip: readOptions.offset },
        { $limit: readOptions.limit },
      ])
      .toArray();
  };

  const read = async (readOptions: ReadOptions) => {
    const filters = readOptions.filters ?? [];
    const limit = readOptions.limit ?? env.DEFAULT_PAGE_SIZE;
    const offset = readOptions.offset ?? 0;

    const entitiesFound = await readHelper({
      filters,
      limit,
      offset,
    });

    logger.trace({
      entityName: collectionName,
      method: "read",
      result: `found ${entitiesFound.length} entities`,
    });
    return entitiesFound;
  };

  const readByIdHelper = async (id: IdType) => {
    if (!ObjectId.isValid(id))
      throw errorBuilder.notFound(idKey, id, "invalid id format");

    const entity = await collection.findOne<EntitiesMap[N]>({
      [idKey]: new ObjectId(id),
    });

    if (!entity) throw errorBuilder.notFound(idKey, id);

    return entity;
  };

  const readById = async (id: IdType) => {
    const entity = await readByIdHelper(id);

    logger.trace({
      entityName: collectionName,
      method: "readById",
      result: entity,
    });

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

    logger.trace({
      entityName: collectionName,
      method: "update",
      result: insertionResult,
    });

    if (!insertionResult.acknowledged)
      throw errorBuilder.general("update", "not acknowledged");

    if (insertionResult.modifiedCount <= 0) return entityToUpdate;

    const updatedEntity = await readByIdHelper(id);

    return updatedEntity;
  };

  const deleteOne = async (id: IdType) => {
    const entityToDelete = await readByIdHelper(id);

    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });

    logger.trace({
      entityName: collectionName,
      method: "delete",
      result,
    });

    if (!result.acknowledged)
      throw errorBuilder.general("delete", "not acknowledged");

    if (result.deletedCount <= 0)
      throw errorBuilder.general("delete", "nothing was deleted");

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
