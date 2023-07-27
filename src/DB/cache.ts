import { env } from "../setup/env";

interface CacheEntry<T> {
  value: T;
  expirationTime: number;
  prev: string | null;
  next: string | null;
}

interface CacheData<T> {
  [key: string]: CacheEntry<T>;
}

/**
 * Creates a cache with a doubly linked list (DLL) to keep track of the most recently used entries.
 * @param defaultTTL - the default TTL for the cache entries (in milliseconds)
 * @returns the cache object
 * @example
 * ```ts
 * const cache = createCache<string>();
 *
 * cache.set("key1", "value1");
 * cache.set("key2", "value2");
 *
 * const value1 = cache.get("key1");
 * console.log(value1); // "value1"
 *
 * cache.delete("key2");
 * const value2 = cache.get("key2");
 * console.log(value2); // null
 *
 * const value3 = cache.get("key3");
 * console.log(value3); // null
 * ```
 */
export const createCache = <T = any>(
  defaultTTL: number = env.DEFAULT_CACHE_TTL_MS
) => {
  const cacheData: CacheData<T> = {};
  let head: string | null = null;
  let tail: string | null = null;

  const set = (key: string, value: T, ttlMs: number = defaultTTL): void => {
    const expirationTime = Date.now() + ttlMs;

    if (cacheData[key]) {
      cacheData[key].value = value;
      cacheData[key].expirationTime = expirationTime;
      moveToTail(key);
    } else {
      cacheData[key] = { value, expirationTime, prev: tail, next: null };

      if (tail) {
        cacheData[tail].next = key;
      }

      tail = key;

      if (!head) {
        head = key;
      }

      if (Object.keys(cacheData).length > env.MAX_CACHE_SIZE) {
        delete cacheData[head!];
        const t = cacheData[head!].next;
        if (t) {
          cacheData[t].prev = null;
        }
        head = t;
      }
    }
  };

  const get = (key: string): T | null => {
    const entry = cacheData[key];
    if (entry && entry.expirationTime > Date.now()) {
      moveToTail(key);
      return entry.value;
    }

    deleteCache(key);
    return null;
  };

  const deleteCache = (key: string): void => {
    const entry = cacheData[key];

    if (entry) {
      if (entry.prev) {
        cacheData[entry.prev].next = entry.next;
      } else {
        head = entry.next;
      }

      if (entry.next) {
        cacheData[entry.next].prev = entry.prev;
      } else {
        tail = entry.prev;
      }

      delete cacheData[key];
    }
  };

  const moveToTail = (key: string) => {
    if (tail === key || !cacheData[key]) {
      return;
    }
    const currentPrev = cacheData[key].prev;
    if (currentPrev) {
      cacheData[currentPrev].next = cacheData[key].next;
    } else {
      head = cacheData[key].next;
    }

    const currentNext = cacheData[key].next;
    if (currentNext) {
      cacheData[currentNext].prev = cacheData[key].prev;
    } else {
      tail = cacheData[key].prev;
    }

    cacheData[key].prev = tail;
    cacheData[key].next = null;

    if (tail) {
      cacheData[tail].next = key;
    }

    tail = key;

    if (!head) {
      head = key;
    }
  };

  return {
    /**
     * Set a value in the cache
     * @param key - the key of the value to set
     * @param value - the value to set
     * @param ttl - the TTL of the value (in milliseconds)
     */
    set,

    /**
     * Get a value from the cache
     * @param key - the key of the value to get
     * @returns the value found or null if not found
     */
    get,

    /**
     * Force delete a value from the cache
     * @param key - the key of the value to delete
     */
    delete: deleteCache,
  };
};
