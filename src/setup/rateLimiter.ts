import { fastifyRateLimit } from "@fastify/rate-limit";
import { Redis } from "ioredis";

import { env } from "./env";
import { Application } from "../types/application";
import { logger } from "../logging/logger";
import { isValidateToken } from "../routes/v1/auth/auth";
import { FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "../errorHandling/errorHandler";

/**
 * A Redis instance to use for rate limiting.
 */
const redis = new Redis(env.REDIS_URL, {
  /*
   That configuration is recommended by `@fastify/rate-limit` to achieve performance.
   @see https://github.com/fastify/fastify-rate-limit/blob/master/example/example.js
  */
  connectTimeout: 500, // in ms
  maxRetriesPerRequest: 1,

  lazyConnect: true,
  retryStrategy: (times: number) => {
    if (times === 1) {
      logger.warn(
        `Redis connection closed unexpectedly, Rate limiter is not set up!`
      );
    } else {
      logger.verbose(
        `Retrying to connect to Redis in ${env.RECONNECTING_INTERVAL_REDIS_S} seconds...`
      );
    }
    return env.RECONNECTING_INTERVAL_REDIS_S * 1000;
  },
})
  .on("connect", () => {
    logger.info(`Successfully connected to Redis, Rate limiter is set up!`);
  })
  .on("error", (error) => {
    logger.error(`Error while connecting to Redis! ${error}`);
  });

const keyGenerator = (req: FastifyRequest) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !isValidateToken(token)) {
    return req.ip;
  }
  return token;
};

export const setRateLimiter = async (app: Application) => {
  await redis.connect();

  await app.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    redis,
    keyGenerator,
    errorResponseBuilder(req, context) {
      logger.warn(
        `Rate limit exceeded for ${req.ip} with the token ${req.headers.authorization}`
      );

      return {
        message: `Rate limit exceeded, retry in ${context.after} seconds`,
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
      };
    },
  });
  app.setErrorHandler(errorHandler); // TODO: fix duplication of error handler
};
