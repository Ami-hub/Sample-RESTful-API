import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

import { logger } from "../logging/logger";
import { setApiVersion1 } from "../routes/v1/apiV1Plugin";
import { Application } from "../application";
import { getDbConnector } from "../DB/databaseConnector";

const welcomeRoute = async (_request: FastifyRequest, reply: FastifyReply) => {
  reply.status(StatusCodes.OK).send({
    message: `Welcome to the API`,
  });
};

const livenessRoute = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.status(StatusCodes.OK).send({
    status: "alive",
  });
};

const readinessRoute = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const dbConnected = await getDbConnector().isConnected();

  if (!dbConnected) {
    reply.status(StatusCodes.SERVICE_UNAVAILABLE).send({
      status: "not ready",
      dbConnected,
    });
    return;
  }

  reply.status(StatusCodes.OK).send({
    status: "ready",
    dbConnected,
  });
};

const API_PREFIX = "/api";

export const setApi = async (app: Application) => {
  await app.register(
    async (api) => {
      await setApiVersion1(api);

      api.get(`/`, welcomeRoute);
      api.get(`/liveness`, livenessRoute);
      api.get(`/readiness`, readinessRoute);
    },
    { prefix: API_PREFIX }
  );

  logger.info(`Application fully initialized`);
};
