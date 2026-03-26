import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Application } from "../../src/application";
import { buildTestApp, resetTestState, setDbConnected } from "../helpers/testApp";

describe("API readiness route", () => {
  let app: Application;

  beforeEach(async () => {
    app = await buildTestApp();
  });

  afterEach(async () => {
    await app.close();
    resetTestState();
  });

  it("GET /api/readiness returns ready when DB is connected", async () => {
    setDbConnected(true);

    const response = await app.inject({
      method: "GET",
      url: "/api/readiness",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ready",
      dbConnected: true,
    });
  });

  it("GET /api/readiness returns service unavailable when DB is disconnected", async () => {
    setDbConnected(false);

    const response = await app.inject({
      method: "GET",
      url: "/api/readiness",
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      status: "not ready",
      dbConnected: false,
    });
  });
});
