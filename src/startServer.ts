import { initializeApp, startListen } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { getDbConnector } from "./DB/databaseConnector";
import { Application, getApplicationInstance } from "./application";

const start = async () => {
  logger.info(`Starting the server...`);

  const app: Application = getApplicationInstance();

  await getDbConnector().connect();

  await initializeApp(app);

  await startListen(app);

  logger.info(`Server is up and running!`);
};

start();
