import { FastifyPluginOptions } from "fastify";

import { Application } from "../../types/application";
import { getEntityPlugin } from "./baseEntityPlugin/entityPlugin";
import { getLoginPlugin } from "./auth/login";
import { setBearerAuthMiddleware } from "./auth/auth";
import { EntitiesMapDB } from "../../types/general";
import { logger } from "../../logging/logger";

export const API_V1_PREFIX = "/api/v1";

const setEntitiesPlugins = async <T extends keyof EntitiesMapDB>(
  app: Application,
  entityNames: T[]
) => {
  await Promise.all(
    entityNames.map(async (entityName) => {
      await app.register(getEntityPlugin(entityName), {
        prefix: `/${entityName}`,
      });
    })
  );

  return app;
};

const getProtectedRoutesPlugin =
  () =>
  async (
    app: Application,
    _options: FastifyPluginOptions,
    done: (error?: Error) => void
  ) => {
    await setBearerAuthMiddleware(app);

    await setEntitiesPlugins(app, ["users", "theaters"]);

    done();
  };

const getUnprotectedRoutesPlugin =
  () =>
  async (
    app: Application,
    _options: FastifyPluginOptions,
    done: (error?: Error) => void
  ) => {
    await app.register(getLoginPlugin(), {
      prefix: `/login`,
    });

    done();
  };

export const getApiVersion1Plugin =
  () =>
  async (
    app: Application,
    _options: FastifyPluginOptions,
    done: (error?: Error) => void
  ) => {
    await app.register(getProtectedRoutesPlugin());

    await app.register(getUnprotectedRoutesPlugin());

    logger.verbose(`API version 1 initialized`);

    done();
  };
