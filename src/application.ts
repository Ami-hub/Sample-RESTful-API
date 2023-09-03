import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { randomBytes } from "crypto";
import { StatusCodes } from "http-status-codes";

import { logger } from "./logging/logger";
import { errorHandler } from "./errorHandling/errorHandler";
import { setRateLimiter } from "./setup/rateLimiter";
import { createErrorWithStatus } from "./errorHandling/statusError";
import { env } from "./setup/env";

const startGracefulShutdown = async (app: FastifyInstance) => {
  logger.info(`Trying to close the application gracefully...`);
  setTimeout(() => {
    logger.fatal(`Application has not been closed gracefully!`);
    process.exit(1);
  }, env.GRACEFUL_SHUTDOWN_TIMEOUT_LIMIT_MS);
  await app.close();
  logger.info(`Application has been closed gracefully`);
  process.exit(0);
};

const requestIdLength = 8;
const generateRequestId = () => randomBytes(requestIdLength).toString("hex");

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
  const app = Fastify({
    logger,
    genReqId: generateRequestId,
  });

  env.ENABLE_RATE_LIMITING
    ? await setRateLimiter(app)
    : logger.info(`Rate limiting is disabled`);

  await app.register(fastifyRequestContext);

  setNotFoundHandler(app);

  app.setErrorHandler(errorHandler);

  process.on("unhandledRejection", async (error) => {
    logger.fatal(`Unhandled rejection: ${error}`);
    await startGracefulShutdown(app);
  });

  process.on("SIGTERM", async () => {
    logger.info(`SIGTERM signal received`);

    await startGracefulShutdown(app);
  });

  return app.withTypeProvider<JsonSchemaToTsProvider>();
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Fastify instance with the type provider
 */
export type Application = UnwrapPromise<
  ReturnType<typeof getApplicationInstance>
>;
