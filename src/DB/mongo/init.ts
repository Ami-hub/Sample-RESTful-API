import { MongoClient } from "mongodb";
import { env } from "../../env";
import { EntitiesMap } from "../../types/general";
import { logger } from "../../logging/logger";

const client = new MongoClient(env.MONGODB_URI);

/**
 * Connects to the DB
 * @NOTE if you have already connected to the DB, this function will do nothing
 */
export const connectToDB = async () => {
  try {
    await client.connect();
  } catch (error) {
    logger.error(`Error connecting to DB: ${error}`);
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
