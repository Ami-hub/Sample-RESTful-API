import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "../../utils/env";

const client = new MongoClient(env.MONGODB_URI);

export const connectToDB = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log("Cannot connect to DB");
    console.log("Please check:");
    console.log(
      "\tYour DB connection string\n\tYour internet connection\n\tYour ip address is whitelisted in DB"
    );
    process.exit(1);
  }
};

export const getDbInstance = () => {
  return client.db(env.MAIN_DB_NAME);
};

export const getCollection = (collectionName: string) => {
  return getDbInstance().collection(collectionName);
};

export const disconnectFromDB = async () => {
  await client.close();
};
