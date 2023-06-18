import express, { Application } from "express";
import { initializeApp, runApp } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { env } from "./setup/env";
import { getDbConnector } from "./DB/databaseConnector";

const main = async () => {
  logger.info(`Starting in ${env.NODE_ENV} mode...`);

  const app: Application = express();
  const dbConnector = await getDbConnector();
  await dbConnector.connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await runApp(app);
  logger.info(`Server is up and running!`);
};

main();
