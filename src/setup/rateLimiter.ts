import { fastifyRateLimit } from "@fastify/rate-limit";
import { Redis } from "ioredis";

import { env } from "./env";
import { Application } from "../types/application";
import { logger } from "../logging/logger";

/**
 * A Redis instance to use for rate limiting.
 * The following config is recommended by `@fastify/rate-limit` to achieve performance.
 *
 * @see https://github.com/fastify/fastify-rate-limit/blob/master/example/example.js
 */
const redis = new Redis(env.REDIS_URL, {
  connectTimeout: 500, // in ms
  maxRetriesPerRequest: 1,

  lazyConnect: true,
  retryStrategy: (times: number) => {
    if (times === 1) {
      logger.warn(
        `Redis connection closed unexpectedly, Rate limiter is not set up!`
      );
    } else {
      logger.verbose(`Retrying to connect to Redis in 5 seconds...`);
    }
    return 5000;
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
    max: 3, // TODO: add to env
    timeWindow: "1 minute",
    redis,
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
    },
  });

  return app;
};
