import { FastifyInstance, FastifyRequest } from "fastify";
import { fastifyRateLimit } from "@fastify/rate-limit";
import { StatusCodes } from "http-status-codes";
import { Redis } from "ioredis";

import { env } from "./env";
import { logger } from "../logging/logger";
import { isValidToken } from "../routes/v1/auth/auth";
import { createErrorWithStatus } from "../errorHandling/statusError";

const setEventListeners = (redis: Redis) => {
  redis.on("connect", () => {
    logger.debug(`Connected to Redis`);
    logger.info(`Rate limiter is now available`);
  });

  redis.on("error", (error) => {
    logger.error({
      message: `Error in Redis`,
      error,
    });
  });

  redis.on("end", () => {
    logger.debug(`Redis connection has ended`);
    logger.error(`Rate limiter is unavailable currently`);
  });

  redis.on("close", () => {
    logger.debug(`Redis connection has closed`);
    logger.error(`Rate limiter is unavailable currently`);
  });
};

const createRedisInstance = () => {
  const redisInstance = new Redis(env.REDIS_URL, {
    /*
     That configuration is recommended by `@fastify/rate-limit` to achieve performance.
     @see https://github.com/fastify/fastify-rate-limit/blob/master/example/example.js
    */
    connectTimeout: 500, // in ms
    maxRetriesPerRequest: 1,

    retryStrategy: (times: number) => {
      logger.debug(
        `Retrying to connect to Redis in ${env.RECONNECTING_INTERVAL_REDIS_S} seconds for the ${times} time...`
      );

      return env.RECONNECTING_INTERVAL_REDIS_S * 1000;
    },
  });

  setEventListeners(redisInstance);

  return redisInstance;
};

const keyGenerator = (req: FastifyRequest) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !isValidToken(token)) return req.ip;
  return token;
};

export const setRateLimiter = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    redis: createRedisInstance(),
    keyGenerator,
    errorResponseBuilder: (_req, context) => {
      throw createErrorWithStatus(
        `Rate limit exceeded, retry in ${(
          context.ttl / 1000
        ).toFixed()} seconds`,
        StatusCodes.TOO_MANY_REQUESTS
      );
    },
  });

  return fastify;
};
