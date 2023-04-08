import express from "express";

const main = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

main();
