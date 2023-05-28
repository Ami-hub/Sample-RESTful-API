import express, { Application } from "express";
import { initializeApp, runApp } from "./setup/initSetUp";
import { logger } from "./logging/logger";
import { env } from "./env";
import { PrismaClient } from "@prisma/client";

const main = async () => {
  const app: Application = express();
  const prisma: PrismaClient = new PrismaClient();
  await prisma.$connect();

  await initializeApp(app, prisma);
  logger.info(`The app was initialized successfully`);

  await runApp(app);
  logger.info(`Server is up and running on ${env.NODE_ENV} mode!`);
};

main();
