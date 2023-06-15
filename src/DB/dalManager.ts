import { EntitiesMap } from "../types/general";
import { connectToDB, disconnectFromDB, isConnected } from "./db";
import { EntityDAL, getEntityDAL } from "./entityDAL";

export interface DalGetter {
  get: <T extends keyof EntitiesMap>(entityName: T) => EntityDAL<T>;
}

/**
 * Manager for the DALs in the system
 *
 * @example
 * ```ts
 * const dalManager: DalManager = await getDalManager();
 * await dalManager.connect();
 *
 * const theatersDAL = dalManager.dalGetter.get("theaters");
 *
 * const theaters = await theatersDAL.getAll();
 * console.log(`I got ${theaters.length} theaters!`);
 *
 * await dalManager.disconnect();
 * ```
 */
export interface DalManager {
  /**
   * Connect to the database
   * @NOTE if you have already connected to the DB, this function will do nothing
   */
  connect(): Promise<void>;

  /**
   * Checks if the DB is connected
   * @returns true if the DB is connected, false otherwise
   * @example
   * ```ts
   * const dalManager: DalManager = await getDalManager();
   * await dalManager.connect();
   * const isConnected = await dalManager.isConnected();
   * console.log(`Am I connected? ${isConnected}`);
   * // prints: Am I connected? true
   * await dalManager.disconnect();
   * console.log(`Am I connected? ${isConnected}`);
   * // prints: Am I connected? false
   * ```
   */
  isConnected(): Promise<boolean>;

  /**
   * Get an entity dal by a collection name name
   * @param collectionName name of the collection
   * @returns the matching entity dal
   * @example
   * ```ts
   * const moviesDAL = dalManager.dalGetter.get("movies");
   *
   * const accounts = await accountsDal.readAllAccounts();
   * console.log(`I have ${accounts.length} accounts`);
   *
   * await dalManager.disconnect();
   * ```
   */
  dalGetter: DalGetter;

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;
}

// ########################################
//             Implementation
// ########################################

/**
 * Get a mongoDB implementation of the DalManager interface
 */
export const getDalManager = async (): Promise<DalManager> => {
  return {
    connect: connectToDB,
    isConnected: isConnected,
    dalGetter: {
      get: getEntityDAL,
    },
    disconnect: disconnectFromDB,
  };
};
