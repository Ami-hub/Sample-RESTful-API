import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { logger } from "../logging/logger";
import { env } from "../setup/env";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error(
    `Got the error: ${JSON.stringify(error)} from the requestId ${request.id}`
  );

  const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;

  const errorMessage =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? getReasonPhrase(statusCode)
      : error.message;

  reply.status(statusCode).send({
    error: errorMessage,
  });
};
