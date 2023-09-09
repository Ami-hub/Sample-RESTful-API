import { setApi } from "./setup/apiPlugin";
import { logger } from "./logging/logger";
import { getDbConnector } from "./DB/databaseConnector";
import { Application, getApplicationInstance } from "./application";
import { env } from "./setup/env";

const startListen = async (app: Application) => {
  try {
    await app.listen({
      host: env.ENABLE_LISTENING_TO_ALL_INTERFACES ? "0.0.0.0" : "localhost",
      port: env.PORT,
    });
  } catch (error) {
    logger.fatal(`Cannot start the server: ${error}`);
    process.exit(1);
  }
};

const start = async () => {
  logger.info(`Starting the server...`);

  const app = await getApplicationInstance();

  await getDbConnector().connect();

  await setApi(app);

  await startListen(app);

  logger.info(`Server is up and running!`);
};

start();
