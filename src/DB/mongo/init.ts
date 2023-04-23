import { MongoClient } from "mongodb";
import { env } from "../../utils/env";
import { EntitiesMap } from "../../types/general";

const client = new MongoClient(env.MONGODB_URI);

export const connectToDB = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("Cannot connect to DB!");
    console.log("Please make sure:");
    console.log(
      "\t1. Your DB connection string is valid.\n\t2. Your internet connection is stable.\n\t3. Your ip address is whitelisted in your DB."
    );
  }
};

export const getDbInstance = () => {
  return client.db(env.MAIN_DB_NAME);
};

export const getCollection = <E extends keyof EntitiesMap>(
  collectionName: E
) => {
  return getDbInstance().collection<EntitiesMap[E]>(collectionName);
};

export const disconnectFromDB = async () => {
  await client.close();
};
