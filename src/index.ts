import express, { Application } from "express";
import { mongoImplementationName } from "./types/general";
import { initializeApp, runApp } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { env } from "./env";

const main = async () => {
  const app: Application = express();

  await initializeApp(app, mongoImplementationName);
  logger.info(`The app was initialized successfully`);

  await runApp(app);
  logger.info(`Server is up and running on ${env.NODE_ENV} mode!`);
};

main();
