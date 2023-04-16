import { config } from "dotenv";
import { cleanEnv, str, port, url } from "envalid";

config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
  PORT: port(),
  MONGODB_URI: url(),
  MAIN_DB_NAME: str(),
});
