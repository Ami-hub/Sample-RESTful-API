import Fastify from "fastify";
import { fastifyRequestContext } from "@fastify/request-context";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { randomBytes } from "crypto";

import { logger } from "./logging/logger";
import { errorHandler } from "./errorHandling/errorHandler";
import { setRateLimiter } from "./setup/rateLimiter";
import { env } from "./setup/env";
import { setNotFoundHandler } from "./errorHandling/errorHandler";

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
  });

  env.ENABLE_RATE_LIMITING
    ? await setRateLimiter(app)
    : logger.info(`Rate limiting is disabled`);

  await app.register(fastifyRequestContext);

  setNotFoundHandler(app);

  app.setErrorHandler(errorHandler);

  return app.withTypeProvider<JsonSchemaToTsProvider>();
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Fastify instance with the type provider
 */
export type Application = UnwrapPromise<
  ReturnType<typeof getApplicationInstance>
>;
