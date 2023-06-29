import { errorHandler } from "../errorHandling/errorHandler";
import { logger } from "../logging/logger";
import { getEntityDAL } from "../DB/entityDAL";
import { env } from "./env";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { authMiddleware, initLoginRoute } from "../routing/routes/v1/login";
import { Application } from "..";

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

  const schema = {
    body: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      additionalProperties: true,
    },
    querystring: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      additionalProperties: true,
    },
    params: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      additionalProperties: true,
    },
  };

  app.post("/the/url", { schema }, async (request, reply) => {
    reply.send(`valid body: ${JSON.stringify(request.body)}`);
  });

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
  app.get(`${baseApiUri}/theaters`, async (request, reply) => {
    reply.send(await theaterDAL.get());
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
