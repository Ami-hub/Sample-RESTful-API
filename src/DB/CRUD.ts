import { ObjectId } from "mongodb";
import { EntitiesMap, Filter, IdKey, IdType, idKey } from "../types/general";
import { isValidId } from "../validators/validators";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

export interface CRUD<T extends EntitiesMap[keyof EntitiesMap]> {
  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or null if not created
   */
  create(data: T): Promise<T | null>;

  /**
   * Gets all entity instances
   * @returns an array of entity instances
   */
  read(
    filters?: Array<Filter<T>>,
    limit?: number,
    skip?: number
  ): Promise<Array<T>>;

  /**
   * Updates an entity instance
   * @param id id of the entity instance
   * @param data data of the entity instance
   * @returns the updated entity instance or null if not found
   */
  update(id: IdType, data: Partial<Omit<T, IdKey>>): Promise<T | null>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns the deleted entity instance or null it did not delete
   */
  delete(id: IdType): Promise<T | null>;
}

// ########################################
//             Implementation
// ########################################

const DEFAULT_ENTITIES_AMOUNT_PER_REQUEST = 15;
const DEFAULT_SKIP = 0;

export const getCRUD = <T extends keyof EntitiesMap>(collectionName: T) =>
  //  : CRUD<EntitiesMap[T]>
  {
    const collection = getCollection(collectionName);

    const read = async (
      filters: Array<Filter<EntitiesMap[T]>> = [],
      limit: number = DEFAULT_ENTITIES_AMOUNT_PER_REQUEST,
      skip: number = DEFAULT_SKIP
    ) => {
      logger.debug(
        `Trying to read ${limit}: ${collectionName} start from ${skip} with filters: ${JSON.stringify(
          filters,
          null,
          4
        )}`
      );

      const result = await collection
        .find<EntitiesMap[T]>({})
        .limit(limit) // TODO: remember to remove this
        .toArray();

      logger.debug(`Read ${result.length} entities from ${collectionName}`);
      return result;
    };

    const readById = async (id: IdType) => {
      if (!isValidId(id)) return null;
      const result = await read(
        [{ key: idKey, value: id } as Filter<EntitiesMap[T]>], // TODO: get rid of this cast
        1
      );
      return result.length > 0 ? result[0] : null;
    };

    const create = async (data: Omit<EntitiesMap[T], IdKey>) => {
      logger.debug(
        `create: ${collectionName} - ${JSON.stringify(data, null, 4)}`
      );
      const result = await collection.insertOne(data);
      if (!result.acknowledged) return null;
      return readById(result.insertedId.toString());
    };

    const update = async (
      id: IdType,
      data: Partial<Omit<EntitiesMap[T], IdKey>>
    ) => {
      logger.debug(
        `update: ${collectionName} - ${id} - ${JSON.stringify(data, null, 4)}`
      );
      const toUpdate = await readById(id);
      if (!toUpdate) return null;
      const result = await collection.updateOne(
        { [idKey]: new ObjectId(id) },
        { $set: data }
      );
      return result.acknowledged ? toUpdate : null;
    };

    const deleteOne = async (id: IdType) => {
      logger.debug(`delete: ${collectionName} - ${id}`);
      const toDelete = await readById(id);
      if (!toDelete) return null;
      const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
      return result.acknowledged ? toDelete : null;
    };

    return {
      readAll: read,
      readById,
      create,
      update,
      delete: deleteOne,
    };
  };
