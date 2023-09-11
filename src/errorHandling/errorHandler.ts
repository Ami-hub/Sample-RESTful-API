import {
  FastifyRequest,
  FastifyReply,
  FastifyError,
  FastifyInstance,
} from "fastify";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import { logger } from "../logging/logger";
import { env } from "../setup/env";
import { createErrorWithStatus } from "./statusError";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error({
    reqId: request.id,
    error,
  });

  const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

  const errorMessage =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? getReasonPhrase(statusCode)
      : error.message;

  reply.status(statusCode).send({
    error: errorMessage,
  });
};

export const setNotFoundHandler = (fastify: FastifyInstance) => {
  return fastify.setNotFoundHandler(
    {
      preHandler: env.ENABLE_RATE_LIMITING ? fastify.rateLimit() : undefined,
    },
    (_request: FastifyRequest, _reply: FastifyReply) => {
      throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
    }
  );
};
