import { FastifyReply, FastifyRequest } from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import { StatusCodes } from "http-status-codes";

import { logger } from "../logging/logger";
import { env } from "./env";
import { errorHandler } from "../errorHandling/errorHandler";
import { setApiVersion1 } from "../routes/v1/apiV1Plugin";
import { Application } from "../types/application";
import { setRateLimiter } from "./rateLimiter";
import { createErrorWithStatus } from "../errorHandling/statusError";

const setNotFoundHandler = (app: Application) => {
  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit(),
    },
    (_request: FastifyRequest, _reply: FastifyReply) => {
      throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
    }
  );
};

const welcomeRoute = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.status(StatusCodes.OK).send({
    message: `Welcome to the API`,
  });
};

const API_PREFIX = "/api";

export const initializeApp = async (app: Application) => {
  await setRateLimiter(app);
  await app.register(fastifyRequestContext);
  await app.register(
    async (api) => {
      await setApiVersion1(api);

      api.get(`/`, welcomeRoute);
      logger.trace(`Welcome route initialized`);
    },
    { prefix: API_PREFIX }
  );

  setNotFoundHandler(app);
  app.setErrorHandler(errorHandler);

  logger.info(`Application fully initialized`);
};

export const startListen = async (app: Application) => {
  try {
    await app.listen({
      host: env.ENABLE_LISTENING_TO_ALL_INTERFACES ? "0.0.0.0" : "localhost",
      port: env.PORT,
    });
  } catch (error) {
    logger.fatal(`Cannot start the server: ${error}`);
    process.exit(1);
  }
};
