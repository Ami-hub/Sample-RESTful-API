import express from "express";
import { mongoImplementationName } from "./types/general";
import { initilizeApp, runApp } from "./setup/initSetUp";

const main = async () => {
  const app = express();

  await initilizeApp(app, mongoImplementationName);

  runApp(app);
};

main();
