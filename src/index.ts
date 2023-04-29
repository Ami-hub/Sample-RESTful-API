import express from "express";
import { env } from "./utils/env";
import { getAccountRouter } from "./routing/routers/accountRouter";
import { getDalManager } from "./DB/dalManager";
import {
  accountCollectionName,
  mongoImplementationName,
} from "./types/general";

const main = async () => {
  const app = express();

  const dalManager = await getDalManager(mongoImplementationName).connect();
  const entityDalGetter = dalManager.getEntityDalByName;

  app.use(express.json());

  app.use(`/${accountCollectionName}`, getAccountRouter(entityDalGetter));

  app.get("/", (_req, res) => {
    res.send({
      Response: "Hello World",
    });
  });

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server is listening at http://localhost:${env.PORT}`);
  });
};

main();
