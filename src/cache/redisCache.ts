import { createClient } from "redis";
import { env } from "../setup/env";
import { logger } from "../logging/logger";
import { EntitiesMapDB } from "../types/general";

const REDIS_RECONNECTING_INTERVAL_MS = 10000; // TODO: move to env

const client = createClient({
  url: env.REDIS_URL,
}).on("error", async (error) => {
  logger.error(`Redis: Error: ${error}`);
  logger.warn(`Redis: Trying to reconnect to Redis`);
  await client.disconnect();
  setTimeout(async () => {
    await client.connect();
  }, REDIS_RECONNECTING_INTERVAL_MS);
});

interface CashConnector {
  /**
   * Connects to the Redis server.
   * @returns Whether the connection was successful.
   */
  connect: () => Promise<void>;

  /**
   * Checks whether the Redis server is connected or not.
   * @returns true if connected, false otherwise.
   */
  isConnected: () => Promise<boolean>;

  /**
   * Disconnects from the Redis server.
   * @returns Whether the disconnection was successful.
   */
  disconnect: () => Promise<void>;
}

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

const isConnected = async () => {
  try {
    await client.ping();
    return true;
  } catch (error) {
    return false;
  }
};

const connectToRedis = async () => {
  logger.verbose(`Redis: Trying to connect to Redis`);
  try {
    if (await isConnected()) {
      logger.info(`Redis: Already connected to Redis`);
      return;
    }

    await client.connect();
    logger.info(`Redis: Connected to Redis`);
  } catch (error) {
    logger.error(`Redis: Could not connect to Redis due to: ${error}`);
    logger.warn(`Caching will not be used`);
    return;
  }
};

const disconnectFromRedis = async () => {
  try {
    if (!(await isConnected())) {
      return;
    }
    await client.disconnect();
  } catch (error) {
    logger.error(`Redis: Cannot disconnect from Redis due to: ${error}`);
  }
};

export const getCashConnector = (): CashConnector => {
  return {
    connect: connectToRedis,
    isConnected,
    disconnect: disconnectFromRedis,
  };
};

export const getEntityCache = <T extends keyof EntitiesMapDB>(
  entityName: T
): RedisCache<T> | undefined => {
  if (!env.ENABLE_CACHING) {
    logger.warn(`Caching is disabled`);
    return;
  }

  const set = async (
    key: string,
    value: EntitiesMapDB[T][],
    expirySec?: number
  ) => {
    try {
      if (!(await isConnected())) {
        logger.silly(`Redis: Not connected to Redis`);
        return false;
      }

      const result = await client.set(key, JSON.stringify(value), {
        EX: expirySec || env.DEFAULT_CACHE_EXPIRY_SEC,
      });
      logger.debug(`Redis: Set key '${key}'`);
      return result === "OK";
    } catch (error) {
      logger.error(`Redis: Could not set key '${key}' due to: ${error}`);
      return false;
    }
  };

  const get = async (key: string) => {
    try {
      if (!(await isConnected())) {
        logger.silly(`Redis: Not connected to Redis`);
        return;
      }
      const value = await client.get(key);
      if (!value) return;
      logger.debug(`Redis: got value for key '${key}'`);
      return JSON.parse(value) as EntitiesMapDB[T][];
    } catch (error) {
      logger.error(
        `Redis: Could not get value for key '${key}' due to: ${error}`
      );
      return;
    }
  };

  const del = async (key: string) => {
    try {
      if (!(await isConnected())) {
        logger.silly(`Redis: Not connected to Redis`);
        return 0;
      }
      const numDeleted = await client.del(key);
      logger.debug(`Redis: deleted key '${key}'`);
      return numDeleted;
    } catch (error) {
      logger.error(`Redis: Could not delete key '${key}' due to: ${error}`);
      return 0;
    }
  };

  return {
    set,
    get,
    delete: del,
  };
};
