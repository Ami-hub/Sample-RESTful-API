import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { StatusCodes } from "http-status-codes";
import { logger } from "../logging/logger";

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error(
    `Got the error: ${JSON.stringify(error)} from the requestId ${request.id}`
  );

  const statusCode = error.statusCode ?? 500;

  if (statusCode == StatusCodes.BAD_REQUEST) {
    reply.status(StatusCodes.BAD_REQUEST).send({
      error: "invalid request",
    });
    return;
  }

  if (statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    reply.status(StatusCodes.BAD_REQUEST).send({
      error: "unknown error",
    });
    return;
  }

  reply.status(statusCode).send({
    error: error.message,
  });
};
