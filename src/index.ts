import express from "express";
import { getDalManager } from "./DB/dalManager";
import { getMongoCRUD } from "./DB/mongo/mongoCRUD";
import { env } from "./utils/env";

const main = async () => {
  const app = express();

  // Goal of how to read all customers from the database
  /*
  const dalManager = await getDalManager().connect();
  const customersDal = dalManager.getEntityDalByName("customers");
  const allCustomers = await customersDal.readAll();
  console.log(allCustomers);
  await dalManager.disconnect();
  */

  const dalManager = await getDalManager("mongo").connect();

  const crud = getMongoCRUD("accounts");

  await dalManager.disconnect();

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
