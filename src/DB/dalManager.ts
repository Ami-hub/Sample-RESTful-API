import { EntitiesMap } from "../types/general";
import { getMongoDalManager } from "./mongo/mongoDalManager";

/**
 * Names of the implementations of the DalManager interface
 */
type implementationsNames = "mongo";

/**
 * Map of the implementations of the DalManager interface
 *
 * @property mongo - mongoDB implementation
 */
const implementations: Record<implementationsNames, DalManager> = {
  mongo: getMongoDalManager(),
};

export interface DalManager {
  /**
   * Connect to the database
   * @returns a promise that resolves to the connected DAL manager
   * @NOTE if you have already connected to the DB, this function will do nothing

   */
  connect(): Promise<DalManager>;

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

export const getDalManager = (
  implementationName: implementationsNames
): DalManager => {
  return implementations[implementationName];
};
