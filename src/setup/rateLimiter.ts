import { fastifyRateLimit } from "@fastify/rate-limit";
import { Redis } from "ioredis";

import { env } from "./env";
import { Application } from "../types/application";
import { logger } from "../logging/logger";

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
    logger.info(`Successfully connected to Redis!`);
  })
  .on("error", (error) => {
    logger.error(`Error while connecting to Redis! ${error}`);
  });

export const initRateLimiter = async (app: Application) => {
  await redis.connect();

  app.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX_REQUESTS_PER_WINDOW,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    redis,
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
    },
  });

  return app;
};
