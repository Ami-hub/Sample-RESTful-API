import { MongoClient } from "mongodb";
import { env } from "../../env";
import { EntitiesMap } from "../../types/general";
import { logger } from "../../logging/logger";

/**
 * The client that connects to the DB
 * @NOTE This project uses only one client for the DB!
 */
const client = new MongoClient(env.MONGODB_URI);

/**
 * The interval in which the DB will try to reconnect to the DB if the connection is failed
 */
const reconnectingIntervalMs = 15000;
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
export const isConnected = () => {
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
 * Gets a collection from the DB
 * @param collectionName name of the collection
 * @returns a collection from the DB
 */
export const getCollection = <T extends keyof EntitiesMap>(
  collectionName: T
) => {
  return getDbInstance().collection(collectionName);
};

/**
 * Disconnects from the DB
 */
export const disconnectFromDB = async () => {
  await client.close();
};
