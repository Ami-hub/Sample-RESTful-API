import express from "express";
import { env } from "./env";

const main = async () => {
  const app = express();
  const port = env.PORT;

  app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port ${port}`);
  });
};

main();
