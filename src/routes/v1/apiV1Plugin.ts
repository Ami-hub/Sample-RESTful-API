import { FastifyPluginOptions } from "fastify";
import { fastifyBearerAuth } from "@fastify/bearer-auth";

import { Application } from "../../types/application";
import { env } from "../../setup/env";
import { getEntityPlugin } from "./baseEntityPlugin/entityPlugin";
import { getLoginPlugin } from "./auth/login";

export const API_V1_PREFIX = "/api/v1";

const getProtectedRoutesPlugin =
  () =>
  async (
    app: Application,
    _options: FastifyPluginOptions,
    done: (error?: Error) => void
  ) => {
    await app.register(fastifyBearerAuth, {
      keys: new Set([env.JWT_SECRET]),
    });

    await app.register(getEntityPlugin(`theaters`), {
      prefix: `/theaters`,
    });
    await app.register(getEntityPlugin(`users`), {
      prefix: `/users`,
    });

    done();
  };

export const getApiVersion1Plugin =
  () =>
  async (
    fastify: Application,
    _options: FastifyPluginOptions,
    done: (error?: Error) => void
  ) => {
    await fastify.register(getProtectedRoutesPlugin());

    await fastify.register(getLoginPlugin(), {
      prefix: `/login`,
    });

    done();
  };
