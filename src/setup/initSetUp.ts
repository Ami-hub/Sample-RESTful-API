import { getAccountRouter } from "../routing/routers/accountRouter";
import { errorHandler } from "../errorHandling/errorHandler";
import { ImplementationNames, accountCollectionName } from "../types/general";
import express, { Application, Express } from "express";
import { env } from "../env";
import { getDalManager } from "../DB/dalManager";
import { logger } from "../logging/logger";
import { getDefaultsRoutes } from "../routing/routes/default";
import {
  httpRequestsLogger,
  httpResponsesLogger,
} from "../logging/loggerMiddleware";

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api";

export const initializeApp = async (
  app: Application,
  implementationName: ImplementationNames
) => {
  app.use(express.json());
  logger.verbose(`Initialized JSON body parser middleware`);

  await initializeHttpTrafficLoggers(app);
  logger.verbose(`All HTTP traffic loggers initialized`);

  await initializeEntitiesRouters(app, implementationName);
  logger.verbose(`All entities routers initialized`);

  await initializeDefaultRoutes(app);
  logger.verbose(`All default routes initialized`);

  app.use(errorHandler);
  logger.verbose(`Initialized error handler`);

  return app;
};

const initializeHttpTrafficLoggers = async (app: Application) => {
  app.use(httpRequestsLogger);
  logger.verbose(`Initialized HTTP requests logger`);

  app.use(httpResponsesLogger);
  logger.verbose(`Initialized HTTP responses logger`);

  return app;
};
const initializeDefaultRoutes = async (app: Application) => {
  const { notFoundRoutes, welcomeRoutes } = await getDefaultsRoutes();
  app.use(`${baseApiUri}`, welcomeRoutes);
  logger.verbose(`Initialized welcome route`);
  app.use(notFoundRoutes);
  logger.verbose(`Initialized 'not found' route`);

  return app;
};

const initializeEntitiesRouters = async (
  app: Application,
  implementationName: ImplementationNames
) => {
  const dalManager = await getDalManager(implementationName).connect();
  const entityDalGetter = dalManager.getEntityDalByName;

  app.use(
    `${baseApiUri}/${accountCollectionName}`,
    getAccountRouter(entityDalGetter)
  );
  logger.verbose(`Initialized ${accountCollectionName} router`);
};

/**
 * The host to listen to in production mode (all interfaces)
 */
const prodHost = "0.0.0.0";

/**
 * The host to listen to in development mode
 */
const devHost = "localhost";

export const runApp = async (app: Application) => {
  const host = env.isProd ? prodHost : devHost;
  app.listen(env.PORT, host, () => {
    logger.verbose(`Listening on port ${env.PORT}`);
  });

  return app;
};
