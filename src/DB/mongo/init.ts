import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "../../env";

const client = new MongoClient(env.MONGODB_URI);

export const connectToDB = async () => {
  await client.connect();
};

export const getCollection = (collectionName: string) => {
  return client.db(env.MAIN_DB_NAME).collection(collectionName);
};

export const disconnectFromDB = async () => {
  await client.close();
};
