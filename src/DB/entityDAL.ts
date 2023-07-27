import { ObjectId } from "mongodb";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import {
  EntitiesMapDB,
  EntityJSONSchemaMap,
  Filter,
  IdType,
  getEntityJSONSchema,
  getEntityPartialJSONSchema,
  EntityPartialJSONSchemaMap,
  idKey,
  EntitiesMapDBWithoutId,
} from "../types/general";
import { getCRUD } from "./CRUD";
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
   * Get the partial JSON schema of the entity
   * @returns the partial JSON schema of the entity
   */
  getPartialSchema(): EntityPartialJSONSchemaMap[T];

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
  get(
    offset?: number,
    limit?: number,
    filters?: Filter<EntitiesMapDB[T]>[]
  ): Promise<EntitiesMapDB[T][]>;

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
  const errorBuilder = getEntityErrorBuilder(entityName);
  const entitySchema = getEntityJSONSchema(entityName);
  const entityPartialSchema = getEntityPartialJSONSchema(entityName);

  const get = async (
    offset?: number,
    limit?: number,
    filters: Filter<EntitiesMapDB[T]>[] = [{}]
  ) => {
    logger.verbose(
      `trying to GET entities from ${entityName}, filters: ${JSON.stringify(
        filters,
        null,
        4
      )}`
    );
    const entities = await entityCrud.read(filters, limit, offset);
    logger.info(`found ${entities.length} entities from ${entityName}`);
    return entities;
  };

  const getByIdHelper = async (id: IdType) => {
    const entitiesFound = await entityCrud.read(
      [
        {
          [idKey]: id,
        },
      ],
      1
    );
    return entitiesFound[0];
  };

  const getById = async (id: IdType) => {
    logger.verbose(
      `trying to GET ONE entity from ${entityName} by id: "${id}"`
    );
    return await getByIdHelper(id);
  };

  const create = async (data: EntitiesMapDBWithoutId[T]) => {
    logger.verbose(
      `trying to CREATE entity to ${entityName}: ${JSON.stringify(
        data,
        null,
        4
      )}`
    );
    const createdId = await entityCrud.create(data);
    if (!createdId) {
      throw errorBuilder.general("create");
    }
    return await getByIdHelper(createdId);
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[T]>
  ) => {
    logger.verbose(
      `trying to UPDATE entity from ${entityName} by id: "${id}", to ${JSON.stringify(
        data,
        null,
        4
      )}`
    );
    const isUpdated = await entityCrud.update(id, data);
    if (!isUpdated) {
      throw errorBuilder.general("update");
    }
    const UpdatedEntity = await getByIdHelper(id);

    return UpdatedEntity;
  };

  const deleteOne = async (id: IdType) => {
    logger.verbose(`trying to DELETE entity from ${entityName} by id: "${id}"`);
    const entityToDelete = await getByIdHelper(id);

    const isDeleted = await entityCrud.delete(id);
    if (!isDeleted) {
      throw errorBuilder.general("delete");
    }
    return entityToDelete;
  };

  return {
    getSchema: () => entitySchema,
    getPartialSchema: () => entityPartialSchema,
    get,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
