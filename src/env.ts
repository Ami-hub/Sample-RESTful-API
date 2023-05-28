import { config } from "dotenv";
import { cleanEnv, str, port, url } from "envalid";

config();

/**
 * The environment variables
 * @property `NODE_ENV` - The environment of the application.
 * @property `PORT` - The port of the application.
 * @property `DATABASE_URL` - The MongoDB URI.
 * @property `MAIN_DB_NAME` - The name of the main DB.
 *
 * @example
 * ```ts
 * console.log(env.NODE_ENV); // "development"
 * console.log(env.PORT); // 3000
 * console.log(env.DATABASE_URL); // mongodb+srv://nyUserName:mySecretPassword@myClusterName.1a2b3c4.mongodb.net/
 * console.log(env.MAIN_DB_NAME); // "myDB"
 * ```
 */
export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  PORT: port(),
  DATABASE_URL: url(),
  JWT_SECRET: str(),
});
