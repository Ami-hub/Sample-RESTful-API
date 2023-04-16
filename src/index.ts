import express from "express";
import { env } from "./utils/env";
import { connectToDB, getCollection } from "./DB/mongo/init";
import { getMongoDal } from "./DB/mongo/mongoDal";

const main = async () => {
  const app = express();
  const dal = getMongoDal();
  dal.connect();

  const collection = getCollection("restaurants");

  const kingsHighwayRestaurants = await collection
    .find({ borough: "Brooklyn", "address.street": "Kings Highway" })
    .toArray();

  console.log(JSON.stringify(kingsHighwayRestaurants, null, 4));

  app.get("/", (_req, res) => {
    res.send({
      "restaurants in `Kings Highway` street, Brooklyn":
        kingsHighwayRestaurants,
    });
  });

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server is listening at http://localhost:${env.PORT}`);
  });
};

main();
