import express, { Application } from "express";
import { initializeApp, runApp } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { env } from "./env";
import { getDalManager } from "./DB/dalManager";

const main = async () => {
  logger.info(`Starting in ${env.NODE_ENV} mode...`);
  const app: Application = express();

  const dalManager = await getDalManager();

  await initializeApp(app, dalManager.dalGetter);
  logger.info(`Initializing done!`);

  await runApp(app);
  logger.info(`Server is up and running!`);
};

main();
