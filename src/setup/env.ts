import { config } from "dotenv";
import { randomBytes } from "crypto";
import { cleanEnv, str, port, url, num, makeValidator, bool } from "envalid";

const getRandomJWTSecret = () => btoa(randomBytes(256).toString("hex"));

const availableLogLevel = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

config();

/**
 * The environment variables of the application.
 * For more info, see the @link[Environment Variables Documentation](../../documentation/envConfiguration.md).
 * @example
 * ```ts
 * console.log(env.PORT); // 3000
 * ```
 */
export const env = cleanEnv(process.env, {
  /**
   * The MongoDB URI to connect to the cluster.
   * @see[MongoDB Connection String URI Format](https://mongodb.com/docs/connections\trings/)
   * @example
   * ```env
   * MONGODB_URI=mongodb+srv://username:password@cluster0.1a2b3c4.mongodb.net/
   * ```
   */
  MONGODB_URI: url(),

  /**
   * The name of the DB to use.
   */
  DB_NAME: str(),

  /**
   * Whether to enable logging or not.
   * @default true
   */
  ENABLE_LOGGING: bool({ default: true }),

  /**
   * The log level of the application.
   * @default "info"
   */
  LOG_LEVEL: str({
    choices: availableLogLevel,
    default: "info",
  }),

  /**
   * The exposed port of the application. Make sure there is no other service using this port.
   * @default 3000
   */
  PORT: port({ default: 3000 }),

  /**
   * The default amount of entities to return per request.
   * @default 15
   */
  DEFAULT_PAGE_SIZE: num({ default: 15 }),

  /**
   * The maximum amount of entities to return per request.
   * @default 50
   */
  MAX_PAGE_SIZE: num({ default: 50 }),

  /**
   * The max time to wait for a DB connection to be established.
   * @default 15000
   * @see[MongoDB Connection Options](https://mongodb.com/docs/drivers/node/current/fundam\entals/connection/connection-options/) for more info.
   * @see[Connection Pooling](https://mongodb.com/docs/drivers/node/current/fundam\entals/connection/pooling/) for more info.
   * @see[Connection Pooling in MongoDB](https://mongodb.com/blog/post/server-side-connections-are-coming-to-the-node-js-driver) for more info.
   */
  CONNECT_DB_TIMEOUT_MS: num({ default: 15000 }),

  /**
   * Whether to listening to all network interfaces or not.
   * @default true
   */
  ENABLE_LISTENING_TO_ALL_INTERFACES: bool({ default: true }),

  /**
   * The secret of the JWT.
   * @default "A base64 encoded string of 256 random bytes"
   * @example OGUxNGE2M2hkM2YyMzAwMDE3NmQ4MmYxYz...
   */
  JWT_SECRET: str({
    default: getRandomJWTSecret(),
  }),

  /**
   * The expiration time of the JWT in minutes.
   * @default 30
   */
  JWT_EXPIRES_MINUTES: num({ default: 30 }),

  /**
   * The max pool size of the DB.
   * @default 20
   * @see[Connection Pool Overview](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) for more info.
   */
  MAX_DB_POOL_SIZE: num({ default: 20 }),

  /**
   * The min pool size of the DB.
   * @default 10
   * @see[Connection Pool Overview](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) for more info.
   */
  MIN_DB_POOL_SIZE: num({ default: 10 }),

  /**
   * The maximum time a connection can remain idle in the pool before being removed and closed.
   * @default 30000
   * @see[Connection Pool Overview](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) for more info.
   */
  MAX_IDLE_TIME_DB_MS: num({ default: 30000 }),

  /**
   * The write concern level of the DB.
   * @default "majority"
   * @see[MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/)
   */
  WRITE_CONCERN: makeValidator((input: string) => {
    if (input === "majority") return input;
    const num = Number(input);
    if (num === 0 || num === 1 || num === 2) return num;
    throw new Error("WRITE_CONCERN must be 0, 1, 2, or 'majority'!");
  })({
    default: "majority",
  }),

  /**
   * The write concern timeout of the DB.
   * @default 3000
   * @see[MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/)
   */
  WRITE_CONCERN_TIMEOUT: num({
    default: 3000,
  }),

  /**
   * The interval in which the DB will try to reconnect to the DB if the connection is failed (in seconds).
   * @default 15
   */
  RECONNECTING_INTERVAL_DB_S: num({
    default: 15,
  }),

  /**
   * Whether to enable the rate limiter or not.
   * @default false
   */
  ENABLE_RATE_LIMITING: bool({ default: false }),

  /**
   * Redis URL to connect to for the rate limiter.
   *
   * @default "redis://localhost:6379"
   * @example ```env
   * REDIS_URL=rediss://ami:password@my-host:6379
   * ```
   */
  REDIS_URL: url({
    default: "redis://localhost:6379",
  }),

  /**
   * The interval in which the Redis will try to reconnect to the Redis if the connection is failed (in seconds).
   * @default 5
   */
  RECONNECTING_INTERVAL_REDIS_S: num({
    default: 5,
  }),

  /**
   * The window of the rate limiter in milliseconds.
   * @default 60000 (1 minute)
   */
  RATE_LIMIT_WINDOW_MS: num({
    default: 60000,
  }),

  /**
   * The max amount of requests per window.
   * @default 30
   */
  RATE_LIMIT_MAX_REQUESTS_PER_WINDOW: num({
    default: 30,
  }),
});

/**
 * The environment variables of the application.
 */
export type EnvironmentVariables = typeof env;
