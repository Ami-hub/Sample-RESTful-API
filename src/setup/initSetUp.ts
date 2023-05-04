import { getAccountRouter } from "../routing/routers/accountRouter";
import { errorHandler } from "../errorHandling/errorHandler";
import { ImplementationNames, accountCollectionName } from "../types/general";
import express, { Express } from "express";
import { env } from "../env";
import { getDalManager } from "../DB/dalManager";

export const initilizeApp = async (
  app: Express,
  implementationName: ImplementationNames
) => {
  app.use(express.json());

  await initilizeEntetiesRouters(app, implementationName);

  app.use("/", (_req, res) => {
    res.send({
      Response: "Hello World",
    });
  });

  app.use(errorHandler);

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
};

export const runApp = async (app: Express) => {
  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server is up and listening on port ${env.PORT}`);
  });
  return app;
};
