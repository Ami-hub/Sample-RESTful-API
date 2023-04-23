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
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance
   * @throws { Error } if the data represents an invalid entity instance
   */
  create(data: Omit<T, IdKey>): Promise<IdType>;

  /**
   * Updates an entity instance
   * @param id id of the entity instance
   * @param data data of the entity instance
   * @returns the updated entity instance
   * @throws { Error } if the data represents an invalid part of an entity instance
   */
  update(id: IdType, data: Partial<Omit<T, IdKey>>): Promise<T>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns the deleted entity instance or null it not deleted
   * @throws { Error } if the entity instance does not exist
   */
  delete(id: IdType): Promise<T | null>;
}
