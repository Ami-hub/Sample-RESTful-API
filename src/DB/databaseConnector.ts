import { MongoClient } from "mongodb";
import { env } from "../setup/env";
import { logger } from "../logging/logger";
import { EntitiesMap } from "../types/general";
import { EntityDAL, getEntityDAL } from "./entityDAL";

export interface databaseConnector {
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
   * Disconnect from the database
   */
  disconnect(): Promise<void>;
}

// ########################################
//             Implementation
// ########################################

/**
 * The client that connects to the DB
 * @NOTE This project uses only one client for the DB!
 */
const client = new MongoClient(env.MONGODB_URI, {
  maxPoolSize: env.MAX_POOL_SIZE,
  minPoolSize: env.MIN_POOL_SIZE,
  connectTimeoutMS: env.CONNECT_DB_TIMEOUT_MS,
  maxIdleTimeMS: env.MAX_IDLE_TIME_MS,
  writeConcern: {
    w: env.WRITE_CONCERN,
    wtimeout: env.WRITE_CONCERN_TIMEOUT,
  },
});

/**
 * The interval in which the DB will try to reconnect to the DB if the connection is failed
 */
const reconnectingIntervalMs = 15000; // TODO move to .env
/**
 * Connects to the DB
 * @param retry if true, will try to reconnect to the DB if the connection is failed
 * @NOTE if you have already connected to the DB, this function will do nothing
 */
export const connectToDB = async (retry: boolean = false) => {
  logger.verbose(`Trying to connect to '${env.MAIN_DB_NAME}' DB`);
  try {
    await client.connect();
    logger.info(`Connected to '${env.MAIN_DB_NAME}' DB`);
  } catch (error) {
    logger.error(`Failed to connect to '${env.MAIN_DB_NAME}' DB ${
      retry ? `retrying in ${reconnectingIntervalMs / 1000} seconds...` : ""
    }
    `);
    if (retry) {
      setTimeout(() => {
        logger.verbose(`try to reconnect to '${env.MAIN_DB_NAME}' DB...`);
      }, reconnectingIntervalMs);
    }
  }
};

/**
 * Checks if the DB is connected
 *
 * @returns true if the DB is connected, false otherwise
 */
export const isConnected = async () => {
  try {
    getDbInstance().command({ ping: 1 });
    return true;
  } catch (error) {
    return false;
  }
};

const getDbInstance = () => {
  return client.db(env.MAIN_DB_NAME);
};
/**
 * Disconnects from the DB
 */
export const disconnectFromDB = async () => {
  await client.close();
};

/**
 * Get a mongoDB implementation of the DalManager interface
 */
export const getDbConnector = async (): Promise<databaseConnector> => {
  return {
    connect: connectToDB,
    isConnected: isConnected,
    disconnect: disconnectFromDB,
  };
};

/**
 * Gets a collection from the DB
 * @param collectionName name of the collection
 * @returns a collection from the DB
 */
export const getCollection = <T extends keyof EntitiesMap>(
  collectionName: T
) => {
  return getDbInstance().collection(collectionName);
};
