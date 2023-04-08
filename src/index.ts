import express from "express";
import { env } from "./env";

const main = async () => {
  const app = express();

  app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${env.PORT}`);
  });
};

main();
