import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import { logger } from "../logging/logger";

import { EntitiesMap, IdType } from "../types/general";
import { getValidator } from "../validators/validators";
import { getCRUD } from "./CRUD";

export interface EntityDAL<T extends keyof EntitiesMap> {
  getAll(): Promise<EntitiesMap[T][]>;

  getById(id: IdType): Promise<EntitiesMap[T] | null>;

  create(data: unknown): Promise<EntitiesMap[T]>;

  update(id: IdType, data: unknown): Promise<EntitiesMap[T]>;

  delete(id: IdType): Promise<EntitiesMap[T]>;
}

// ########################################
//             Implementation
// ########################################

export const getEntityDAL = <T extends keyof EntitiesMap>(
  entityName: T
): EntityDAL<T> => {
  const entityCrud = getCRUD(entityName);
  const errorBuilder = getEntityErrorBuilder(entityName);
  const entityValidator = getValidator(entityName);

  const getAll = async () => {
    logger.debug(`readAll: ${entityName}`);
    return await entityCrud.readAll();
  };

  const getById = async (id: IdType) => {
    logger.debug(`readById: ${entityName}`);
    return await entityCrud.readById(id);
  };

  const create = async (data: unknown) => {
    logger.debug(`create: ${entityName}`);
    const valid = entityValidator.validateEntity(data);
    const id = await entityCrud.create(valid);
    if (!id) {
      throw errorBuilder.generalError("create");
    }
    return id;
  };

  const update = async (id: IdType, data: unknown) => {
    logger.debug(`update: ${entityName}`);
    const valid = entityValidator.validateFields(data);
    const updated = await entityCrud.update(id, valid);

    if (!updated) {
      throw errorBuilder.generalError("update");
    }
    return updated;
  };

  const deleteOne = async (id: IdType) => {
    logger.debug(`delete: ${entityName}`);
    const deleted = await entityCrud.delete(id);
    if (!deleted) {
      throw errorBuilder.generalError("delete");
    }
    return deleted;
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
