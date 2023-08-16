import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

import { logger } from "../logging/logger";
import { env } from "./env";
import { errorHandler } from "../errorHandling/errorHandler";
import { API_V1_PREFIX, getApiVersion1Plugin } from "../routes/v1/apiV1Plugin";
import { Application } from "../types/application";
import { setRateLimiter } from "./rateLimiter";
import { createErrorWithStatus } from "../errorHandling/statusError";

const notFoundHandler = (_request: FastifyRequest, _reply: FastifyReply) => {
  throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
};

const welcomeRoute = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.status(StatusCodes.OK).send({
    message: `Welcome to the API`,
  });
};

export const initializeApp = async (app: Application) => {
  app.register(async (childApp) => {
    await setRateLimiter(childApp);

    await childApp.register(getApiVersion1Plugin(), {
      prefix: API_V1_PREFIX,
    });

    childApp.get(`/`, welcomeRoute);
    logger.verbose(`Welcome route Initialized`);

    childApp.setErrorHandler(errorHandler);
    logger.verbose(`Error handler initialized`);

    childApp.setNotFoundHandler(notFoundHandler);
    logger.verbose(`Not found handler initialized`);
  });

  logger.info(`App is initialized successfully!`);
};

export const startListen = async (app: Application) => {
  try {
    await app.listen({
      host: env.ENABLE_LISTENING_TO_ALL_INTERFACES ? "0.0.0.0" : "localhost",
      port: env.PORT,
    });

    logger.info(`Server is listening on port ${env.PORT}`);
  } catch (error) {
    logger.error(`Error while starting the server: ${error}`);
    process.exit(1);
  }
};
