import { MongoClient } from "mongodb";
import { env } from "../setup/env";
import { logger } from "../logging/logger";
import { EntitiesMapDB } from "../types/general";
/**
 // TODO return to this
const CURRENT_DB_NAME = env.isProd 
  ? env.DB_BASE_NAME
  : env.isDev
  ? env.DB_BASE_NAME + "_dev"
  : env.DB_BASE_NAME + "_test";
*/

const CURRENT_DB_NAME = env.DB_BASE_NAME;

export interface DatabaseConnector {
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
 * Connects to the DB
 * @NOTE if you have already connected to the DB, this function will do nothing
 */
export const connectToDB = async (retry: boolean = env.ENABLE_RECONNECTING) => {
  if (await isConnected()) {
    logger.verbose(`Already connected to '${env.DB_BASE_NAME}' DB`);
    return;
  }

  logger.verbose(`Trying to connect to '${env.DB_BASE_NAME}' DB...`);
  try {
    await client.connect();
    logger.info(`Connected to '${env.DB_BASE_NAME}' DB`);
  } catch (error) {
    logger.error(`Failed to connect to '${env.DB_BASE_NAME}' DB ${
      retry
        ? `retrying in ${env.RECONNECTING_INTERVAL_MS / 1000} seconds...`
        : process.exit(1)
    }
      `);
    setTimeout(() => {
      connectToDB();
      logger.verbose(`try to reconnect to '${env.DB_BASE_NAME}' DB...`);
    }, env.RECONNECTING_INTERVAL_MS);
  }
};

/**
 * Checks if the DB is connected
 *
 * @returns true if the DB is connected, false otherwise
 */
export const isConnected = async () => {
  try {
    await getDbInstance().command({ ping: 1 });
    return true;
  } catch (error) {
    return false;
  }
};

const getDbInstance = () => {
  return client.db(CURRENT_DB_NAME);
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
export const getDbConnector = async (): Promise<DatabaseConnector> => {
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
export const getCollection = <T extends keyof EntitiesMapDB>(
  collectionName: T
) => {
  return getDbInstance().collection(collectionName);
};
