import {
  EntitiesMap,
  IdKey,
  IdType,
  ImplementationNames,
  mongoImplementationName,
} from "../types/general";
import { getMongoCRUD } from "./mongo/mongoCRUD";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

/**
 * Gets a CRUD instance
 * @param entityName name of the entity
 * @param implementationName name of the implementation
 * @returns a CRUD instance
 */
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
  readByField<K extends keyof Omit<T, IdKey>>(
    field: K,
    value: Omit<T, IdKey>[K]
  ): Promise<Array<T>>;

  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or null if not created
   */
  create(data: Omit<T, IdKey>): Promise<IdType | null>;

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

const crudMap: {
  [key in ImplementationNames]: <T extends keyof EntitiesMap>(
    collectionName: T
  ) => CRUD<EntitiesMap[T]>;
} = {
  [mongoImplementationName]: getMongoCRUD,
};

/**
 * Gets a CRUD implementation
 * @param collectionName name of the collection
 * @param implementationName name of the implementation
 * @returns a CRUD implementation
 * @throws if the implementation name is invalid
 */
export const getCRUD = <T extends keyof EntitiesMap>(
  implementationName: ImplementationNames,
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const crudCreator = crudMap[implementationName];
  return crudCreator(collectionName);
};
