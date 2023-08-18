import { FastifyInstance, FastifyRequest } from "fastify";
import { fastifyRateLimit } from "@fastify/rate-limit";
import { StatusCodes } from "http-status-codes";
import { Redis } from "ioredis";

import { env } from "./env";
import { logger } from "../logging/logger";
import { isValidToken } from "../routes/v1/auth/auth";
import { createErrorWithStatus } from "../errorHandling/statusError";

const reconnectingIntervalSec = env.RECONNECTING_INTERVAL_REDIS_S;

const setEventListeners = (redis: Redis) => {
  redis.on("connect", () => {
    logger.debug(`Connected to Redis`);
    logger.info(`Rate limiter is set up!`);
  });

  redis.on("error", (error) => {
    logger.error({
      message: `Error in Redis`,
      error,
    });
  });

  redis.on("end", () => {
    logger.debug(`Redis connection has ended`);
    logger.error(`Rate limiter is disabled!`);
  });

  redis.on("close", () => {
    logger.debug(`Redis connection has closed`);
    logger.error(`Rate limiter is disabled!`);
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
        `Retrying to connect to Redis in ${reconnectingIntervalSec} seconds for the ${times} time...`
      );

      return reconnectingIntervalSec * 1000;
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

const redis = env.ENABLE_RATE_LIMITING ? createRedisInstance() : undefined;

export const setRateLimiter = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    redis,
    keyGenerator,
    errorResponseBuilder: (req, context) => {
      throw createErrorWithStatus(
        `Rate limit exceeded, retry in ${(
          context.ttl / 1000
        ).toFixed()} seconds`,
        StatusCodes.TOO_MANY_REQUESTS,
        `reqId: ${req.id}`
      );
    },
  });

  return fastify;
};
