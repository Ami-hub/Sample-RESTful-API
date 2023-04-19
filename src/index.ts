import express from "express";
import { env } from "./utils/env";
import { connectToDB, getCollection } from "./DB/mongo/init";
import { getMongoDalManager } from "./DB/mongo/mongoDal";
import { ObjectId } from "mongodb";
import { accountSchema } from "./validators/accountValidators";
import { customerSchema } from "./validators/customerValidator";

const main = async () => {
  const app = express();
  const dal = getMongoDalManager();
  dal.connect();

  // Goal:
  // const customersDal = await dal.getEntityDalByName("customers");
  // const allCustomers = await customersDal.readAll();
  // console.log(allCustomers);

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
