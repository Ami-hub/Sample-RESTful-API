import { ObjectId } from "mongodb";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import {
  EntitiesMapDB,
  EntityJSONSchemaMap,
  Filter,
  IdType,
  getEntityJSONSchema,
  idKey,
} from "../types/general";
import { getCRUD } from "./CRUD";
import { logger } from "../logging/logger";

/**
 * DAL for a specific entity
 *
 * @example
 * ```ts
 * const moviesDAL = getEntityDAL("movies");
 *
 * const movies = await moviesDAL.get();
 * console.log(movies);
 *
 * // Output:
 * // [
 * //   {
 * //     _id: new ObjectId("5f9d88d3d6b0b3e5d0e0d9a8"),
 * //     name: "The Shawshank Redemption",
 * //     genres: ["Drama"],
 * //     ...
 * //   },
 * //   ...
 * // ]
 * ```
 */
export interface EntityDAL<T extends keyof EntitiesMapDB> {
  getSchema(): EntityJSONSchemaMap[T];

  getPartialSchema(): unknown; // TODO: implement type

  get(
    offset?: number,
    limit?: number,
    filters?: Filter<EntitiesMapDB[T]>[]
  ): Promise<EntitiesMapDB[T][]>;

  getById(id: IdType): Promise<EntitiesMapDB[T]>;

  create(data: unknown): Promise<EntitiesMapDB[T]>;

  update(id: IdType, data: unknown): Promise<EntitiesMapDB[T]>;

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

  const get = async (
    offset?: number,
    limit?: number,
    filters?: Filter<EntitiesMapDB[T]>[]
  ) => {
    logger.debug(
      `get from ${entityName}: offset=${offset}, limit=${limit}, filter=${filters}`
    );
    const entities = await entityCrud.read(filters || [{}], limit, offset);
    return entities;
  };

  const getById = async (id: IdType) => {
    logger.info(`getById: '${id}' from ${entityName}'`);
    if (!ObjectId.isValid(id))
      throw errorBuilder.entityNotFoundError(idKey, id);

    const entitiesFound = await entityCrud.read(
      [
        {
          [idKey]: new ObjectId(id),
        },
      ],
      1
    );
    if (!entitiesFound.length)
      throw errorBuilder.entityNotFoundError(idKey, id);

    return entitiesFound[0];
  };

  const create = async (data: EntitiesMapDB[T]) => {
    const createdId = await entityCrud.create(data);
    if (!createdId) {
      throw errorBuilder.generalError("create");
    }
    return await getById(createdId);
  };

  const update = async (id: IdType, data: Partial<EntitiesMapDB[T]>) => {
    const entityToUpdate = await getById(id);
    const isUpdated = await entityCrud.update(id, data);
    if (!isUpdated) {
      throw errorBuilder.generalError("update");
    }
    return entityToUpdate;
  };

  const deleteOne = async (id: IdType) => {
    const entityToDelete = await getById(id);

    const isDeleted = await entityCrud.delete(id);
    if (!isDeleted) {
      throw errorBuilder.generalError("delete");
    }
    return entityToDelete;
  };

  return {
    getSchema: () => entitySchema,
    getPartialSchema: () => {}, // TODO: implement
    get,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
