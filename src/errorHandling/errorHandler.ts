import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { logger } from "../logging/logger";

export const errorHandler = (
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error(`Error: ${error}`);
  reply.status(error.statusCode || 500).send({
    error: error.message,
  });
};
