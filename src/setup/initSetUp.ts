import { errorHandler } from "../errorHandling/errorHandler";
import { logger } from "../logging/logger";
import { getEntityDAL } from "../DB/entityDAL";
import { env } from "./env";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { initLoginRoute } from "../routes/v1/auth/login";
import { getIdJSONSchemaAsQueryParam } from "../types/general";
import { Application } from "../application";
import { getTheaterPlugin } from "../routes/v1/theaters/theaterPlugin";

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

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api/v1";

export const initializeApp = async (app: Application) => {
  await initLoginRoute(app);
  logger.verbose(`Initialized login route`);

  // Middleware to check authorization header
  //app.addHook("preHandler", authMiddleware);

  await initializeEntitiesRouters(app);
  logger.verbose(`Entities routers initialized`);

  app.get(
    `${baseApiUri}`,
    async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.status(StatusCodes.OK).send({
        message: `Welcome to the API`,
      });
    }
  );
  logger.verbose(`Initialized welcome route`);

  app.setErrorHandler(errorHandler);
  logger.verbose(`Error handler initialized`);

  return app;
};

const initializeEntitiesRouters = async (app: Application) => {
  const theaterDAL = getEntityDAL("theaters");
  const idSchemaAsQueryParam = getIdJSONSchemaAsQueryParam();

  app.register(await getTheaterPlugin("theaters"), {
    prefix: `${baseApiUri}/theaters`,
  });
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
