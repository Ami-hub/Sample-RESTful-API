import { initializeApp, startListen } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { env } from "./setup/env";
import { getDbConnector } from "./DB/databaseConnector";
import { Application, getApplicationInstance } from "./application";

/**
 * The first function to run when the application starts
 */
const start = async () => {
  const app: Application = getApplicationInstance();

  logger.info(`Starting in ${env.NODE_ENV} mode...`);

  const dbConnector = await getDbConnector();
  await dbConnector.connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await startListen(app);
  logger.info(`Server is up and running!`);
};

start();
