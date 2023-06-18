import { config } from "dotenv";
import { cleanEnv, str, port, url, num, makeValidator } from "envalid";

config();

const validEnv = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  PORT: port(),
  MONGODB_URI: url(),
  MAIN_DB_NAME: str(),
  CONNECT_DB_TIMEOUT_MS: num(),
  JWT_SECRET: str(),
  JWT_EXPIRES_MINUTES: str(),
  MAX_POOL_SIZE: num(),
  MIN_POOL_SIZE: num(),
  MAX_IDLE_TIME_MS: num(),
  WRITE_CONCERN: makeValidator((input: string) => {
    if (input === "majority") return input;
    const num = Number(input);
    if (num === 0 || num === 1 || num === 2) return num;
    throw new Error("WRITE_CONCERN must be 0, 1, 2, or 'majority'!");
  })(),
  WRITE_CONCERN_TIMEOUT: num(),
});

/**
 * The environment variables
 * @property `NODE_ENV` - The environment of the application.
 * @property `PORT` - The exposed port of the application.
 * @property `MONGODB_URI` - The MongoDB URI.
 * @property `MAIN_DB_NAME` - The name of the main DB.
 * @property `CONNECT_DB_TIMEOUT_MS` - The max time to wait for a DB connection to be established.
 * @property `JWT_SECRET` - The secret of the JWT.
 * @property `JWT_EXPIRES_MINUTES` - The expiration time of the JWT.
 * @property `MAX_POOL_SIZE` - The max pool size of the DB.
 * @property `MIN_POOL_SIZE` - The min pool size of the DB.
 * @property `MAX_IDLE_TIME_MS` - The maximum time a connection can remain idle in the pool before being removed and closed.
 * @see[MongoDB Connection Options](https://mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/)
 * for more info.
 * @property `WRITE_CONCERN` - The write concern of the DB.
 * @see[MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/)
 * @property `WRITE_CONCERN_TIMEOUT` - The write concern timeout of the DB.
 *
 * @example
 * ```ts
 * console.log(env.NODE_ENV); // "development"
 * console.log(env.PORT); // 3000
 * console.log(env.MONGODB_URI); // mongodb+srv://nyUserName:mySecretPassword@myClusterName.1a2b3c4.mongodb.net/
 * console.log(env.MAIN_DB_NAME); // "myDB"
 * ```
 */
export const env = validEnv;
