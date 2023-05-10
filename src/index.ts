import express from "express";
import { mongoImplementationName } from "./types/general";
import { initializeApp, runApp } from "./setup/initSetUp";

const main = async () => {
  const app = express();

  await initializeApp(app, mongoImplementationName);

  await runApp(app);
};

main();
