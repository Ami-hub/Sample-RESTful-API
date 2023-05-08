import { getAccountRouter } from "../routing/routers/accountRouter";
import { errorHandler } from "../errorHandling/errorHandler";
import { ImplementationNames, accountCollectionName } from "../types/general";
import express, { Express } from "express";
import { env } from "../env";
import { getDalManager } from "../DB/dalManager";
import {
  httpRequestsLogger,
  httpResponsesLogger,
  logger,
} from "../logging/logger";
import { defaultRoutes, helloRoutes } from "../routing/routes/default";

export const initilizeApp = async (
  app: Express,
  implementationName: ImplementationNames
) => {
  app.use(express.json());

  app.use(httpRequestsLogger);
  logger.info(`Initialized HTTP requests logger`);

  app.use(httpResponsesLogger);
  logger.info(`Initialized HTTP responses logger`);

  await initilizeEntetiesRouters(app, implementationName);
  logger.info(`All entities routers initialized`);

  app.get("/", helloRoutes);
  logger.info(`Initialized hello router`);

  app.use(defaultRoutes);
  logger.info(`Initialized default router`);

  app.use(errorHandler);
  logger.info(`Initialized error handler`);

  return app;
};

const initilizeEntetiesRouters = async (
  app: Express,
  implementationName: ImplementationNames
) => {
  const dalManager = await getDalManager(implementationName).connect();
  const entityDalGetter = dalManager.getEntityDalByName;

  app.use(
    `/${accountCollectionName}`,
    getAccountRouter(entityDalGetter(accountCollectionName))
  );
  logger.info(`Initialized ${accountCollectionName} router`);
};

export const runApp = async (app: Express) => {
  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`Server is up and listening on port ${env.PORT}`);
    logger.info(`Running in ${env.NODE_ENV} mode`);
  });

  return app;
};
