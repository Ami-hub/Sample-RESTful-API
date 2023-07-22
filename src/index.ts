import { initializeApp, startListen } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { getDbConnector } from "./DB/databaseConnector";
import { Application, getApplicationInstance } from "./types/application";

/**
 * The first function to run when the application starts
 */
const start = async () => {
  const app: Application = getApplicationInstance();

  logger.info(`The application is starting...`);

  const dbConnector = await getDbConnector();
  await dbConnector.connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await startListen(app);
  logger.info(`Server is up and running!`);
};

start();
