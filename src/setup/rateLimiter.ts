import { fastifyRateLimit } from "@fastify/rate-limit";
import { Redis } from "ioredis";

import { env } from "./env";
import { Application } from "../types/application";
import { logger } from "../logging/logger";
import { getToken, isValidToken } from "../routes/v1/auth/auth";
import { FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

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
});

redis.on("connect", () => {
  logger.verbose(`Successfully connected to Redis!`);
  logger.info(`Rate limiter is set up!`);
});

redis.on("error", (error) => {
  logger.error(`Error in Redis! ${error}`);
});

const connectToRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    logger.error(`Error while connecting to Redis! ${error}`);
  }
};

const keyGenerator = (req: FastifyRequest) => {
  const token = getToken(req.headers.authorization);
  if (!token || !isValidToken(token)) return req.ip;
  return token;
};

export const setRateLimiter = async (app: Application) => {
  await connectToRedis();

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
        message: `Rate limit exceeded, retry in ${context.after}`,
        statusCode: StatusCodes.TOO_MANY_REQUESTS,
      };
    },
  });

  logger.verbose(`Rate limiter initialized`);
};
