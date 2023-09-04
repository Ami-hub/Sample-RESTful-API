import { Application } from "../../application";
import { logger } from "../../logging/logger";
import { setUserPlugin } from "./entitiesPlugins/userPlugin";
import { setTheaterPlugin } from "./entitiesPlugins/theaterPlugin";

export const API_V1_PREFIX = "/v1";

const setEntitiesPluginsV1 = async (apiV1: Application) => {
  await Promise.all([setUserPlugin(apiV1), setTheaterPlugin(apiV1)]);
};

export const setApiVersion1 = async (api: Application) => {
  await api.register(
    async (apiV1) => {
      await setEntitiesPluginsV1(apiV1);
    },
    { prefix: API_V1_PREFIX }
  );

  logger.trace(`API v1 plugin initialized`);
};
