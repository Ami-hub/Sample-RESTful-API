import {
  deferToErrorMiddleware,
  errorHandler,
} from "../errorHandling/errorHandler";
import express, { Application } from "express";
import { logger } from "../logging/logger";
import { httpTrafficLoggerMiddleware } from "../logging/loggerMiddleware";
import { welcomeRoutes, notFoundRoutes } from "../routing/routes/default";
import { getEntityDAL } from "../DB/entityDAL";
import { env } from "./env";

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api/v1";

export const initializeApp = async (app: Application) => {
  app.use(
    express.json({
      inflate: false,
    })
  );
  logger.verbose(`JSON body parser middleware initialized`);

  app.use(httpTrafficLoggerMiddleware);
  logger.verbose(`HTTP traffic logger initialized`);

  await initializeEntitiesRouters(app);
  logger.verbose(`Entities routers initialized`);

  await initializeDefaultRoutes(app);
  logger.verbose(`Default routes initialized`);

  app.use(errorHandler);
  logger.verbose(`Error handler initialized`);

  return app;
};

const initializeDefaultRoutes = async (app: Application) => {
  app.get(`${baseApiUri}`, welcomeRoutes);
  logger.verbose(`Initialized welcome route`);

  app.use(deferToErrorMiddleware(notFoundRoutes));
  logger.verbose(`Initialized 'not found' route`);

  return app;
};

const initializeEntitiesRouters = async (app: Application) => {
  const theaterDAL = getEntityDAL("theaters");
  app.get(
    `${baseApiUri}/theaters`,
    deferToErrorMiddleware(async (_req, res, _next) => {
      const allTheaters = await theaterDAL.getAll();
      res.send(allTheaters);
    })
  );
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
