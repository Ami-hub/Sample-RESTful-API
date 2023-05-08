import { mongoImplementationName } from "../../types/general";
import { DalManager } from "../dalManager";
import { EntitiesDalMap, getEntityDal } from "../entitiesDAL/entitiesDAL";
import { connectToDB, disconnectFromDB } from "./init";

/**
 * Get a mongoDB implementation of the DalManager interface
 */
export const getMongoDalManager = (): DalManager => {
  return {
    connect: async () => {
      connectToDB();
      return getMongoDalManager();
    },
    getEntityDalByName: <T extends keyof EntitiesDalMap>(
      collectionName: T
    ): EntitiesDalMap[T] => {
      return getEntityDal(mongoImplementationName, collectionName);
    },
    disconnect: disconnectFromDB,
  };
};
