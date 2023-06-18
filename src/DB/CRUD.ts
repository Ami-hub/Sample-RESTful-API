import { ObjectId } from "mongodb";
import { EntitiesMap, IdKey, IdType, idKey } from "../types/general";
import { isValidId } from "../validators/validators";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

export interface CRUD<T extends EntitiesMap[keyof EntitiesMap]> {
  /**
   * Gets all entity instances
   * @returns an array of entity instances
   */
  readAll(): Promise<Array<T>>;

  /**
   * Gets an entity instance by id
   * @param id id of the entity instance
   * @returns an entity instance or null if not found
   */
  readById(id: IdType): Promise<T | null>;

  /**
   * Gets all entities instances by a field
   * @param field field of the entity instance
   * @param value value of the field
   * @returns an entity instance or null if not found
   */
  readByField<K extends keyof T>(field: K, value: T[K]): Promise<Array<T>>;

  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or null if not created
   */
  create(data: Omit<T, IdKey>): Promise<T | null>;

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

export const getCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const collection = getCollection(collectionName);

  const readAll = async () => {
    logger.debug(`read all: ${collectionName}`);

    const result = await collection
      .find<EntitiesMap[T]>({})
      .limit(10) // TODO: remember to remove this
      .toArray();
    return result;
  };

  const readById = async (id: IdType) => {
    logger.debug(`readById: ${collectionName} - ${id}`);
    if (!isValidId(id)) return null;
    const result = await collection.findOne<EntitiesMap[T]>({
      [idKey]: new ObjectId(id),
    });
    return result;
  };

  const readByField = async <K extends keyof EntitiesMap[T]>(
    field: K,
    value: EntitiesMap[T][K]
  ) => {
    logger.debug(
      `readByField: ${collectionName} - ${field.toString()} - ${value}`
    );
    const isObjectIdField = false; // TODO: check if field is ObjectId
    const filter = isObjectIdField
      ? { [field]: new ObjectId(String(value)) }
      : { [field]: value };
    const result = await collection.find<EntitiesMap[T]>(filter).toArray();
    return result;
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
    readAll,
    readById,
    readByField,
    create,
    update,
    delete: deleteOne,
  };
};
