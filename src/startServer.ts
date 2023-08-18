import { setApi, startListen } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { getDbConnector } from "./DB/databaseConnector";
import { getApplicationInstance } from "./application";

const start = async () => {
  logger.info(`Starting the server...`);

  const app = await getApplicationInstance();

  await getDbConnector().connect();

  await setApi(app);

  await startListen(app);

  logger.info(`Server is up and running!`);
};

start();
