import { z } from "zod";
import { EntitiesMap } from "../../types/general";
import { DalManager } from "../dalManager";
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
    getEntityDalByName: <T extends keyof EntitiesMap>(collectionName: T) => {
      throw new Error("Not implemented!");
    },
    disconnect: disconnectFromDB,
  };
};
