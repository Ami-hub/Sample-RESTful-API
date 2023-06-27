import { errorHandler } from "../errorHandling/errorHandler";
import { logger } from "../logging/logger";
import { getEntityDAL } from "../DB/entityDAL";
import { env } from "./env";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api/v1";

export const initializeApp = async (app: FastifyInstance) => {
  // app.register(formBodyPlugin);
  // logger.verbose(`JSON body parser middleware initialized`);

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

const initializeEntitiesRouters = async (app: FastifyInstance) => {
  const theaterDAL = getEntityDAL("theaters");
  app.get(`${baseApiUri}/theaters`, async (request, reply) => {
    reply.send(await theaterDAL.getAll());
  });
};

export const startListen = async (app: FastifyInstance) => {
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
