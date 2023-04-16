import { connectToDB, disconnectFromDB, getDbInstance } from "./init";

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
  getEntityDalByName(collectionName: string): Promise<void>;

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;
}

export const getMongoDal = () => {
  return {
    connect: connectToDB,
    getEntityDalByName: (collectionName: string) => {
      throw new Error("Not implemented!");
    },
    disconnect: disconnectFromDB,
  };
};
