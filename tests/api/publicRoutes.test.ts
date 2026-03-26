import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Application } from "../../src/application";
import { buildTestApp, resetTestState } from "../helpers/testApp";

describe("API public routes", () => {
  let app: Application;

  beforeEach(async () => {
    app = await buildTestApp();
  });

  afterEach(async () => {
    await app.close();
    resetTestState();
  });

  it("GET /api returns welcome message", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Welcome to the API" });
  });

  it("GET /api/liveness returns alive status", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/liveness",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "alive" });
  });

  it("unknown route returns not found", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/does-not-exist",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: "Route not found" });
  });
});
