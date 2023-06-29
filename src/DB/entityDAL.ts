import { ObjectId } from "mongodb";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import { EntitiesMapDB, IdType, idKey } from "../types/general";
import { getCRUD } from "./CRUD";

export interface EntityDAL<T extends keyof EntitiesMapDB> {
  getByField(
    fieldName: string,
    fieldValue: any,
    limit?: number,
    skip?: number
  ): Promise<EntitiesMapDB[T][]>;

  getById(id: IdType): Promise<EntitiesMapDB[T] | null>;

  create(data: unknown): Promise<EntitiesMapDB[T]>;

  update(id: IdType, data: unknown): Promise<EntitiesMapDB[T]>;

  delete(id: IdType): Promise<EntitiesMapDB[T]>;
}

// ########################################
//             Implementation
// ########################################

/**
 * Gets an entity dal by collection name
 *
 * @param collectionName name of the collection
 * @returns the matching entity dal
 * @example
 * ```ts
 * const moviesDAL = getEntityDAL("movies");
 *
 * const movies = await moviesDAL.getAll();
 * console.log(`I have ${movies.length} movies!`);
 * ```
 */
export const getEntityDAL = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityDAL<T> => {
  const entityCrud = getCRUD(entityName);
  const errorBuilder = getEntityErrorBuilder(entityName);

  const getByField = async (
    fieldName: string,
    fieldValue: any,
    limit?: number,
    skip?: number
  ) => {
    return await entityCrud.read(
      [{ key: fieldName, value: fieldValue }],
      limit,
      skip
    );
  };

  const getById = async (id: IdType) => {
    if (!ObjectId.isValid(id))
      throw errorBuilder.entityNotFoundError(idKey, id);

    const res = await entityCrud.read(
      [{ key: idKey, value: new ObjectId(id) }],
      1
    );
    if (!res.length) throw errorBuilder.entityNotFoundError(idKey, id);

    return res[0];
  };

  // TODO: fix any
  const create = async (data: any) => {
    const id = await entityCrud.create(data);
    if (!id) {
      throw errorBuilder.generalError("create");
    }
    return id;
  };

  // TODO: fix any
  const update = async (id: IdType, data: any) => {
    const updated = await entityCrud.update(id, data);

    if (!updated) {
      throw errorBuilder.generalError("update");
    }
    return updated;
  };

  const deleteOne = async (id: IdType) => {
    const deleted = await entityCrud.delete(id);
    if (!deleted) {
      throw errorBuilder.generalError("delete");
    }
    return deleted;
  };

  return {
    getByField,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
