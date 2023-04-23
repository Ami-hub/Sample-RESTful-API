import { EntitiesMap } from "../../types/general";
import { connectToDB, disconnectFromDB } from "./init";

interface MongoDal {
  /**
   * Connect to the database
   */
  connect(): Promise<void>;

  /**
   * Get an entity dal by a collection name name
   * @param collectionName name of the collection
   * @returns an entity dal
   */
  getEntityDalByName<T extends keyof EntitiesMap>(collectionName: T): void;

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;
}

export const getMongoDalManager = (): MongoDal => {
  return {
    connect: connectToDB,
    getEntityDalByName: <T extends keyof EntitiesMap>(collectionName: T) => {
      throw new Error("Not implemented!");
    },
    disconnect: disconnectFromDB,
  };
};
