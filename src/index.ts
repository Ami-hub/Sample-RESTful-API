import express from "express";
import { env } from "./env";
import { connectToDB, getCollection } from "./DB/mongo/init";

const main = async () => {
  const app = express();
  await connectToDB();

  const collection = getCollection("restaurants");
  const kingsHighwayRestaurants = await collection
    .find({ borough: "Brooklyn", "address.street": "Kings Highway" })
    .toArray();

  console.log(kingsHighwayRestaurants);

  app.get("/", (_req, res) => {
    res.send({
      "restaurants in Kings `Highway street`, Brooklyn":
        kingsHighwayRestaurants,
    });
  });

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${env.PORT}`);
  });
};

main();
