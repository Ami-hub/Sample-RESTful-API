import { vi } from "vitest";

process.env.MONGODB_URI ??= "mongodb://localhost:27017";

let isDbConnected = true;

vi.mock("../../src/DB/databaseConnector", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/DB/databaseConnector")>();

  return {
    ...actual,
    getDbConnector: () => ({
      connect: vi.fn(async () => undefined),
      disconnect: vi.fn(async () => undefined),
      isConnected: vi.fn(async () => isDbConnected),
    }),
  };
});

import { Application, getApplicationInstance } from "../../src/application";
import { setApi } from "../../src/setup/apiPlugin";

export const setDbConnected = (value: boolean) => {
  isDbConnected = value;
};

export const resetTestState = () => {
  isDbConnected = true;
};

export const buildTestApp = async (): Promise<Application> => {
  const app = await getApplicationInstance();
  await setApi(app);
  return app;
};
