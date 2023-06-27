import { config } from "dotenv";
import { randomBytes } from "crypto";

import { cleanEnv, str, port, url, num, makeValidator, bool } from "envalid";

config();

const validEnv = cleanEnv(process.env, {
  MONGODB_URI: url(),
  DB_BASE_NAME: str(),

  LOG_LEVEL: str({
    choices: ["error", "warn", "info", "verbose", "debug", "silly"],
    default: "info",
  }),

  NODE_ENV: str({
    choices: ["development", "test", "production", "staging"],
    default: "development",
  }),

  PORT: port({ default: 3000 }),

  CONNECT_DB_TIMEOUT_MS: num({ default: 15000 }),

  JWT_SECRET: str({
    default: btoa(randomBytes(64).toString("hex")),
  }),

  JWT_EXPIRES_MINUTES: num({ default: 30 }),

  MAX_POOL_SIZE: num({ default: 20 }),

  MIN_POOL_SIZE: num({ default: 10 }),

  MAX_IDLE_TIME_MS: num({ default: 30000 }),

  WRITE_CONCERN: makeValidator((input: string) => {
    if (input === "majority") return input;
    const num = Number(input);
    if (num === 0 || num === 1 || num === 2) return num;
    throw new Error("WRITE_CONCERN must be 0, 1, 2, or 'majority'!");
  })({
    default: "majority",
  }),

  WRITE_CONCERN_TIMEOUT: num({
    default: 3000,
  }),

  ENABLE_RECONNECTING: bool({
    default: true,
  }),

  RECONNECTING_INTERVAL_MS: num({
    default: 15000,
  }),
});

/**
 * The environment variables
 *
 * @property `NODE_ENV` - The environment of the application.
 *
 * @property `LOG_LEVEL` - The log level of the application.
 *
 * @property `PORT` - The exposed port of the application.
 *
 * @property `MONGODB_URI` - The MongoDB URI.
 *
 * @property `DB_BASE_NAME` - The base name of the DB to use in the production.
 *    For test environment, the DB name will be `DB_BASE_NAME` + `_test`,
 *    and for development environment, the DB name will
 *    be `DB_BASE_NAME` + `_dev`.
 *
 * @property `JWT_SECRET` - The secret of the JWT.
 * @property `JWT_EXPIRES_MINUTES` - The expiration time of the JWT in minutes.
 *
 * @property `CONNECT_DB_TIMEOUT_MS` - The max time to wait for a
 *     DB connection to be established.
 * @property `MAX_POOL_SIZE` - The max pool size of the DB.
 * @property `MIN_POOL_SIZE` - The min pool size of the DB.
 * @property `MAX_IDLE_TIME_MS` - The maximum time a connection can remain
 *    idle in the pool before being removed and closed.
 * @see[MongoDB Connection Options](https://mongodb.com/docs/drivers/node/current/fundam\entals/connection/connection-options/) for more info.
 *
 * @property `WRITE_CONCERN` - The write concern level of the DB.
 * @property `WRITE_CONCERN_TIMEOUT` - The write concern timeout of the DB.
 * @see[MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/)
 *
 * @property `ENABLE_RECONNECTING` - Whether to enable reconnecting to the DB
 *    if the connection is failed. If false, the application will exit if the
 *    connection is failed.
 * @property `RECONNECTING_INTERVAL_MS` - The interval in which the DB will
 *    try to reconnect to the DB if the connection is failed.
 *    If `ENABLE_RECONNECTING` is false, this property will be ignored.
 *
 * @example
 * ```ts
 * console.log(env.NODE_ENV); // "development"
 * console.log(env.DB_BASE_NAME); // "myDB"
 * console.log(env.PORT); // 3000
 * ```
 */
export const env = validEnv;
