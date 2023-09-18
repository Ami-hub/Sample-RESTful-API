import { FastifyInstance } from "fastify";

import { logger } from "../logging/logger";
import { env } from "./env";

const startGracefulShutdown = async (app: FastifyInstance) => {
  logger.info(`Trying to close the application gracefully...`);
  setTimeout(() => {
    logger.fatal(`Application has not been closed gracefully!`);
    process.exit(1);
  }, env.GRACEFUL_SHUTDOWN_TIMEOUT_LIMIT_MS);
  await app.close();
  logger.info(`Application has been closed gracefully`);
  process.exit(0);
};

export const setGracefulShutdown = (app: FastifyInstance) => {
  process.on("SIGTERM", async () => {
    logger.info(`SIGTERM signal received`);
    await startGracefulShutdown(app);
  });

  logger.info(`Graceful shutdown is set up!`);
};
