import Fastify, { FastifyReply } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { logger } from "./logging/logger";
import { randomBytes } from "crypto";
import { errorHandler } from "./errorHandling/errorHandler";
import { setRateLimiter } from "./setup/rateLimiter";
import { fastifyRequestContext } from "@fastify/request-context";
import { FastifyRequest } from "fastify/types/request";
import { StatusCodes } from "http-status-codes";
import { createErrorWithStatus } from "./errorHandling/statusError";

const requestIdLength = 8;
const generateRequestId = () => randomBytes(requestIdLength).toString("hex");

/**
 * Get the main application instance
 * @see https://www.fastify.io/docs/latest/TypeScript/
 */
export const getApplicationInstance = async () => {
  const app = Fastify({
    logger,
    genReqId: generateRequestId,
  }).setErrorHandler(errorHandler);

  await setRateLimiter(app);
  await app.register(fastifyRequestContext);

  app
    .setNotFoundHandler(
      {
        preHandler: app.rateLimit(),
      },
      (_request: FastifyRequest, _reply: FastifyReply) => {
        throw createErrorWithStatus(`Route not found`, StatusCodes.NOT_FOUND);
      }
    )
    .setErrorHandler(errorHandler);

  return app.withTypeProvider<JsonSchemaToTsProvider>();
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Fastify instance with the type provider
 */
export type Application = UnwrapPromise<
  ReturnType<typeof getApplicationInstance>
>;
