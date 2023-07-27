import { createClient } from "redis";
import { env } from "../setup/env";
import { logger } from "../logging/logger";
import { EntitiesMapDB } from "../types/general";

const client = createClient({
  url: env.REDIS_URL,
});

interface RedisCache<T extends keyof EntitiesMapDB> {
  /**
   * Sets a value to a key in the Redis server.
   * @param key The key to set the value to.
   * @param value The value to set.
   * @param expirySec The expiry time of the value in seconds.
   * @returns Whether the value was set successfully.
   */
  set: (
    key: string,
    value: EntitiesMapDB[T][],
    expirySec?: number
  ) => Promise<boolean>;

  /**
   * Gets a value from a key in the Redis server.
   * @param key The key to get the value from.
   * @returns The value of the key.
   */
  get: (key: string) => Promise<EntitiesMapDB[T][] | undefined>;

  /**
   * Deletes a key from the Redis server.
   * @param key The key to delete.
   * @returns The number of keys deleted.
   */
  delete: (key: string) => Promise<number>;
}

export const getEntityCache = async <T extends keyof EntitiesMapDB>(
  entityName: T
): Promise<RedisCache<T> | undefined> => {
  if (!env.ENABLE_CACHING) {
    return;
  }

  try {
    await client.connect();
    logger.info(`Redis: Connected to Redis`);
  } catch (error) {
    logger.error(`Redis: Could not connect to Redis`);
    logger.warn(`Caching will not be used`);
    return;
  }

  const set = async (
    key: string,
    value: EntitiesMapDB[T][],
    expirySec?: number
  ) => {
    try {
      const result = await client.set(key, JSON.stringify(value), {
        EX: expirySec || env.DEFAULT_CACHE_EXPIRY_SEC,
      });
      return result === "OK";
    } catch (error) {
      logger.error(`Redis: Could not set key '${key}' to value '${value}'`);
      return false;
    }
  };

  const get = async (key: string) => {
    try {
      const value = await client.get(key);
      if (!value) return;
      return JSON.parse(value) as EntitiesMapDB[T][];
    } catch (error) {
      logger.error(`Redis: Could not get value for key '${key}'`);
      return;
    }
  };

  const del = async (key: string) => {
    try {
      const numDeleted = await client.del(key);
      return numDeleted;
    } catch (error) {
      logger.error(`Redis: Could not delete key '${key}'`);
      return 0;
    }
  };

  return {
    set,
    get,
    delete: del,
  };
};

export const disconnectFromRedis = async () => {
  try {
    await client.disconnect();
  } catch (error) {
    logger.error(`Redis: disconnecting from Redis`);
  }
};
