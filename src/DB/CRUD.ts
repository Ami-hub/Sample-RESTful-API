import { Entities, IdKey, IdType } from "../types/general";

export interface CRUD<T extends Entities> {
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
   * Gets an entity instance by field
   * @param field field of the entity instance
   * @param value value of the field
   * @returns an entity instance or null if not found
   */
  readByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null>;

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
   * @returns the deleted entity instance or null it not deleted
   */
  delete(id: IdType): Promise<T | null>;
}
