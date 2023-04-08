import express from "express";
import { env } from "./env";

const main = async () => {
  const app = express();
  const port = env.isDev ? 3000 : 80;

  app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

main();
