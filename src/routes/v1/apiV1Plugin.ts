import { FastifyPluginOptions } from "fastify";
import { Application } from "../../types/application";
import { getEntityPlugin } from "./baseEntityPlugin/entityPlugin";

const API_V1_PREFIX = "/api/v1";

export const getApiVersion1Plugin =
  async () =>
  async (fastify: Application, _options: FastifyPluginOptions = {}) => {
    fastify.register(await getEntityPlugin(`theaters`), {
      prefix: `${API_V1_PREFIX}/theaters`,
    });
    fastify.register(await getEntityPlugin(`users`), {
      prefix: `${API_V1_PREFIX}/users`,
    });
    // fastify.register(getMoviePlugin, { prefix: `${API_V1_PREFIX}/movies` }); // TODO: you know what
  };
