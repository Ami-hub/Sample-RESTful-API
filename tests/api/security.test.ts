import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Application } from "../../src/application";
import { buildTestApp, resetTestState } from "../helpers/testApp";

describe("API security", () => {
  let app: Application;

  beforeEach(async () => {
    app = await buildTestApp();
  });

  afterEach(async () => {
    await app.close();
    resetTestState();
  });

  it("GET /api/v1/movies requires bearer token", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/movies",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ error: "Unauthorized" });
  });
});
