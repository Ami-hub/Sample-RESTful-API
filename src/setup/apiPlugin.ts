import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

import { logger } from "../logging/logger";
import { setApiVersion1 } from "../routes/v1/apiV1Plugin";
import { Application } from "../application";

const welcomeRoute = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.status(StatusCodes.OK).send({
    message: `Welcome to the API`,
  });
};

const API_PREFIX = "/api";

export const setApi = async (app: Application) => {
  await app.register(
    async (api) => {
      await setApiVersion1(api);

      api.get(`/`, welcomeRoute);
    },
    { prefix: API_PREFIX }
  );

  logger.info(`Application fully initialized`);
};
