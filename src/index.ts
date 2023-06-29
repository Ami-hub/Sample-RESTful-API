import Fastify from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { initializeApp, startListen } from "./setup/initSetUp";
import { fastifyWinstonLogger, logger } from "./logging/logger";
import { env } from "./setup/env";
import { getDbConnector } from "./DB/databaseConnector";
import { getCRUD } from "./DB/CRUD";

/**
 * The main application instance
 * @see https://www.fastify.io/docs/latest/TypeScript/
 */
const app = Fastify({
  maxRequestsPerSocket: 1000,
  logger: fastifyWinstonLogger,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Fastify instance including the type provider
 */
export type Application = typeof app;

/**
 * The first function to run when the application starts
 */
const start = async () => {
  logger.info(`Starting in ${env.NODE_ENV} mode...`);

  const dbConnector = await getDbConnector();
  await dbConnector.connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await startListen(app);
  logger.info(`Server is up and running!`);
};

start();
