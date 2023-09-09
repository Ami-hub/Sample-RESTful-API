import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { StatusCodes } from "http-status-codes";
import { v4 } from "uuid";

import { logger } from "./logging/logger";
import { errorHandler } from "./errorHandling/errorHandler";
import { setRateLimiter } from "./setup/rateLimiter";
import { createErrorWithStatus } from "./errorHandling/statusError";
import { env } from "./setup/env";
import { setGracefulShutdown } from "./setup/gracefulShutdown";

const setNotFoundHandler = (fastify: FastifyInstance) => {
  return fastify.setNotFoundHandler(
    {
      preHandler: env.ENABLE_RATE_LIMITING ? fastify.rateLimit() : undefined,
    },
    (_request: FastifyRequest, _reply: FastifyReply) => {
      throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
    }
  );
};

/**
 * Get the main application instance
 * @see https://www.fastify.io/docs/latest/TypeScript/
 */
export const getApplicationInstance = async () => {
  const fastify = Fastify({
    logger,
    genReqId: () => v4(),
  });

  await fastify.register(fastifyRequestContext);

  setNotFoundHandler(fastify);

  fastify.setErrorHandler(errorHandler);

  if (env.ENABLE_GRACEFUL_SHUTDOWN) {
    setGracefulShutdown(fastify);
  }

  env.ENABLE_RATE_LIMITING
    ? await setRateLimiter(fastify)
    : logger.info(`Rate limiting is disabled`);

  return fastify.withTypeProvider<JsonSchemaToTsProvider>();
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Fastify instance with the type provider
 */
export type Application = UnwrapPromise<
  ReturnType<typeof getApplicationInstance>
>;
