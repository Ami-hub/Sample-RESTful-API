import { getAccountRouter } from "../routing/routers/accountRouter";
import { errorHandler } from "../errorHandling/errorHandler";
import { accountCollectionName } from "../types/general";
import express, { Application } from "express";
import { env } from "../env";
import { logger } from "../logging/logger";
import { getDefaultsRoutes } from "../routing/routes/default";
import {
  httpRequestsLogger,
  httpResponsesLogger,
} from "../logging/loggerMiddleware";
import { PrismaClient } from "@prisma/client";

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api";

export const initializeApp = async (app: Application, prisma: PrismaClient) => {
  app.use(express.json());
  logger.verbose(`Initialized JSON body parser middleware`);

  await initializeHttpTrafficLoggers(app);
  logger.verbose(`All HTTP traffic loggers initialized`);

  await initializeEntitiesRouters(app, prisma);
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
  const { notFoundRoutes, welcomeRoutes, faviconHandler } =
    await getDefaultsRoutes();
  app.use(faviconHandler);
  logger.verbose(`Initialized favicon handler`);

  app.use(`${baseApiUri}`, welcomeRoutes);
  logger.verbose(`Initialized welcome route`);

  app.use(notFoundRoutes);
  logger.verbose(`Initialized 'not found' route`);

  return app;
};

const initializeEntitiesRouters = async (
  app: Application,
  prisma: PrismaClient
) => {
  //app.use(`${baseApiUri}/${accountCollectionName}`, getAccountRouter(prisma));
  logger.verbose(`Initialized ${accountCollectionName} router`);
};

/**
 * The host to listen to in production mode (all interfaces)
 */
const prodHost = "0.0.0.0";

/**
 * The host to listen to in development mode (localhost only)
 */
const devHost = "localhost";

export const runApp = async (app: Application) => {
  const host = env.isProd ? prodHost : devHost;
  app.listen(env.PORT, host, () => {
    logger.verbose(`Listening on port ${env.PORT}`);
  });

  return app;
};
