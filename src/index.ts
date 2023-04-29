import express from "express";
import { env } from "./utils/env";
import { getAccountRouter } from "./routing/routers/accountRouter";
import { getDalManager } from "./DB/dalManager";
import {
  accountCollectionName,
  mongoImplementationName,
} from "./types/general";
import { ObjectId } from "mongodb";

const main = async () => {
  const app = express();

  const dalManager = await getDalManager(mongoImplementationName).connect();
  const entityDalGetter = dalManager.getEntityDalByName;
  const accountsDal = entityDalGetter(accountCollectionName);
  const account = await accountsDal.readAccountById(
    new ObjectId("5f9c2a7d9d9b3b1e3c9d3b1e")
  );
  if (!account) {
    throw new Error("Account not found");
  }
  console.log(account.products);

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
