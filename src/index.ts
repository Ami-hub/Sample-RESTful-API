import { initializeApp, startListen } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { getDbConnector } from "./DB/databaseConnector";
import { Application, getApplicationInstance } from "./types/application";
import { getCashConnector } from "./cache/redisCache";

/**
 * The first function to run when the application starts
 */
const start = async () => {
  logger.info(`The application is starting...`);

  const app: Application = getApplicationInstance();

  await getDbConnector().connect();

  await getCashConnector().connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await startListen(app);
  logger.info(`Server is up and running!`);
};

start();
