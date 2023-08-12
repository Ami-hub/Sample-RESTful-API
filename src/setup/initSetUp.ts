import { errorHandler } from "../errorHandling/errorHandler";
import { logger } from "../logging/logger";
import { env } from "./env";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { API_V1_PREFIX, getApiVersion1Plugin } from "../routes/v1/apiV1Plugin";
import { Application } from "../types/application";
import { setRateLimiter } from "./rateLimiter";
import { createErrorWithStatus } from "../errorHandling/statusError";

const notFoundHandler = (_request: FastifyRequest, _reply: FastifyReply) => {
  throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
};

const welcomeRoute = async (request: FastifyRequest, reply: FastifyReply) => {
  reply.status(StatusCodes.OK).send({
    message: `Welcome to the API`,
  });
};

export const initializeApp = async (app: Application) => {
  await setRateLimiter(app);
  logger.verbose(`Initialized rate limiter`);

  await app.register(getApiVersion1Plugin(), {
    prefix: API_V1_PREFIX,
  });
  logger.verbose(`Initialized API v1 plugin`);

  app.get(`/`, welcomeRoute);
  logger.verbose(`Initialized welcome route`);

  app.setErrorHandler(errorHandler);
  logger.verbose(`Error handler initialized`);

  app.setNotFoundHandler(notFoundHandler);

  logger.verbose(`Not found handler initialized`);
};

export const startListen = async (app: Application) => {
  try {
    await app.listen({
      host: env.ENABLE_LISTENING_TO_ALL_INTERFACES ? "0.0.0.0" : "localhost",
      port: env.PORT,
    });
  } catch (error) {
    logger.error(`Error while starting the server: ${error}`);
    process.exit(1);
  }
};
