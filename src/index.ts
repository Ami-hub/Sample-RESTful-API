import fastify from "fastify";
import { initializeApp, startListen } from "./setup/initSetUp";
import { fastifyWinstonLogger, logger } from "./logging/logger";
import { env } from "./setup/env";
import { getDbConnector } from "./DB/databaseConnector";

const main = async () => {
  const app = fastify({
    maxRequestsPerSocket: 1000,
    logger: fastifyWinstonLogger,
  });

  logger.info(`Starting in ${env.NODE_ENV} mode...`);

  const dbConnector = await getDbConnector();
  await dbConnector.connect();

  await initializeApp(app);
  logger.info(`Initializing done!`);

  await startListen(app);
  logger.info(`Server is up and running!`);
};

main();
