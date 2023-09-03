import {
  EntitiesMapDB,
  getEntityJSONSchema,
  EntitiesMapDBWithoutId,
  EntityJSONSchemaMap,
} from "../models/entitiesMaps";
import { IdType } from "../models/id";
import { ReadOptions, getCRUD } from "./CRUD";
import { logger } from "../logging/logger";

/**
 * DAL for a specific entity, provides CRUD operations for the entity
 */
export interface EntityDAL<T extends keyof EntitiesMapDB> {
  /**
   * Get the JSON schema of the entity
   * @returns the JSON schema of the entity
   */
  getSchema(): EntityJSONSchemaMap[T];

  /**
   * Get entities from the DB
   * @param offset - the offset of the entities to get
   * @param limit - the limit of the entities to get
   * @param filters - the filters to apply on the entities
   * @returns the entities found
   *
   * @example
   * ```ts
   * const theatersDAL = getEntityDAL("theaters");
   *
   * const theaters = await theatersDAL.get();
   * console.log(theaters);
   *
   * // Output:
   * // [
   * //   {
   * //     _id: "59a47286cfa9a3a73e51e72c",
   * //     name: "Theater 1000",
   * //     location: {
   * //       address: {
   * //         city: "Bloomington",
   * //         state: "MN",
   * //         country: "USA",
   * //         street: "340 W Market",
   * //         zipCode: "55425",
   * //       },
   * //       geoCoordinates: [-93.24565, 44.85466],
   * //     },
   * //   },
   * //   ...
   * // ];
   * ```
   */
  get(readOptions?: ReadOptions): Promise<EntitiesMapDB[T][]>;

  /**
   * Get an entity by id from the DB
   * @param id - the id of the entity to get
   * @returns the entity found
   * @throws {EntityNotFoundError} if the entity was not found
   *
   * @example
   * ```ts
   * const theatersDAL = getEntityDAL("theaters");
   * const theater = await theatersDAL.getById("59a47286cfa9a3a73e51e72c");
   * console.log(theater);
   *
   * // Output:
   * // {
   * //   _id: "59a47286cfa9a3a73e51e72c",
   * //   name: "Theater 1000",
   * //   location: {
   * //     address: {
   * //       city: "Bloomington",
   * //       state: "MN",
   * //       country: "USA",
   * //       street: "340 W Market",
   * //       zipCode: "55425",
   * //     },
   * //     geoCoordinates: [-93.24565, 44.85466],
   * //   },
   * // };
   * ```
   */
  getById(id: IdType): Promise<EntitiesMapDB[T]>;

  /**
   * Create an entity
   * @param data - the data of the entity to create
   * @returns the created entity
   *
   * @example
   * ```ts
   * const theatersDAL = getEntityDAL("theaters");
   * const theater = await theatersDAL.create({
   *   name: "Theater 1000",
   *   location: {
   *     address: {
   *       city: "Bloomington",
   *       state: "MN",
   *       country: "USA",
   *       street: "340 W Market",
   *       zipCode: "55425",
   *     },
   *     geoCoordinates: [-93.24565, 44.85466],
   *   }
   * });
   * console.log(theater);
   *
   * // Output:
   * // {
   * //   _id: "59a47286cfa9a3a73e51e72c",
   * //   name: "Theater 1000",
   * //   location: {
   * //     address: {
   * //       city: "Bloomington",
   * //       state: "MN",
   * //       country: "USA",
   * //       street: "340 W Market",
   * //       zipCode: "55425",
   * //     },
   * //     geoCoordinates: [-93.24565, 44.85466],
   * //   },
   * // };
   * ```
   */
  create(data: EntitiesMapDBWithoutId[T]): Promise<EntitiesMapDB[T]>;

  /**
   * Update an entity by id, and save it to the DB if the entity is valid
   * @param id - the id of the entity to update
   * @param data - the data of the entity to update
   * @returns the updated entity
   *
   */
  update(
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[T]>
  ): Promise<EntitiesMapDB[T]>;

  /**
   * Delete an entity by id from the DB
   * @param id - the id of the entity to delete
   * @returns the deleted entity
   */
  delete(id: IdType): Promise<EntitiesMapDB[T]>;
}

// ########################################
//             Implementation
// ########################################

export const getEntityDAL = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityDAL<T> => {
  const entityCrud = getCRUD(entityName);

  const get = async (readOptions: ReadOptions = {}) => {
    logger.debug({ entityName, method: `get`, filters: readOptions.filters });

    const entities = await entityCrud.read(readOptions);

    logger.info({ entityName, method: `get`, numOfFound: entities.length });
    return entities;
  };

  const getById = async (id: IdType) => {
    logger.debug({ entityName, method: `getById`, id });
    const entityFound = await entityCrud.readById(id);
    logger.info({ entityName, method: `getById`, found: entityFound });
    return entityFound;
  };

  const create = async (data: EntitiesMapDBWithoutId[T]) => {
    logger.debug({ entityName, method: `create`, data });

    const entity = await entityCrud.create(data);
    logger.info({ entityName, method: `create`, created: entity });

    return entity;
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[T]>
  ) => {
    logger.debug({ entityName, method: `update`, id, data });

    const updatedEntity = await entityCrud.update(id, data);

    logger.info({ entityName, method: `update`, updated: updatedEntity });

    return updatedEntity;
  };

  const deleteOne = async (id: IdType) => {
    logger.debug({ entityName, method: `delete`, id });

    const deletedEntity = await entityCrud.delete(id);

    logger.info({ entityName, method: `delete`, deleted: deletedEntity });
    return deletedEntity;
  };

  return {
    getSchema: () => getEntityJSONSchema(entityName),
    get,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
