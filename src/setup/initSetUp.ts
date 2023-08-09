import { errorHandler } from "../errorHandling/errorHandler";
import { logger } from "../logging/logger";
import { env } from "./env";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { initLoginRoute } from "../routes/v1/auth/login";
import { getApiVersion1Plugin } from "../routes/v1/apiV1Plugin";
import { Application } from "../types/application";
import { initRateLimiter } from "./rateLimiter";

// ######################################
const loginJsonSchemaBody = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
  required: ["email", "password"],
};
// ######################################

export const initializeApp = async (app: Application) => {
  await initRateLimiter(app);
  logger.verbose(`Initialized rate limiter`);

  await initLoginRoute(app);
  logger.verbose(`Initialized login route`);

  // Middleware to check authorization header
  //app.addHook("preHandler", authMiddleware);

  app.register(await getApiVersion1Plugin());
  logger.verbose(`Initialized API v1 plugin`);

  app.get(`/`, async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.status(StatusCodes.OK).send({
      message: `Welcome to the API`,
    });
  });
  logger.verbose(`Initialized welcome route`);

  app.setErrorHandler(errorHandler);
  logger.verbose(`Error handler initialized`);

  return app;
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
  return app;
};
