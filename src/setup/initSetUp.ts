import {
  deferToErrorMiddleware,
  errorHandler,
} from "../errorHandling/errorHandler";
import express, { Application } from "express";
import { env } from "../env";
import { logger } from "../logging/logger";
import { httpTrafficLogger } from "../logging/loggerMiddleware";
import { welcomeRoutes, notFoundRoutes } from "../routing/routes/default";
import { DalGetter } from "../DB/dalManager";

/**
 * The base URI for all the API routes
 */
export const baseApiUri = "/api/v1";

export const initializeApp = async (app: Application, dalGetter: DalGetter) => {
  app.use(
    express.json({
      inflate: false,
    })
  );
  logger.verbose(`JSON body parser middleware initialized`);

  app.use(httpTrafficLogger);
  logger.verbose(`HTTP traffic logger initialized`);

  await initializeEntitiesRouters(app, dalGetter);
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

const initializeEntitiesRouters = async (
  app: Application,
  dalGetter: DalGetter
) => {
  const theaterDAL = dalGetter.get("theaters");
  app.get(
    `${baseApiUri}/theaters`,
    deferToErrorMiddleware(async (req, res, next) => {
      logger.debug("I am in theaters route");
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
