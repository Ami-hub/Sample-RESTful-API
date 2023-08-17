import { Application } from "../../application";
import { getEntityPlugin } from "./baseEntityPlugin/entityPlugin";
import { setTokenGeneratorRoute } from "./auth/tokenGenerator";
import { setBearerAuthMiddleware } from "./auth/auth";
import { EntitiesMapDB } from "../../models/general";
import { logger } from "../../logging/logger";

export const API_V1_PREFIX = "/v1";

const setEntitiesPlugins = async <T extends keyof EntitiesMapDB>(
  ProtectedRoutes: Application,
  entityNames: T[]
) => {
  await Promise.all(
    entityNames.map(async (entityName) => {
      await ProtectedRoutes.register(getEntityPlugin(entityName), {
        prefix: `/${entityName}`,
      });
    })
  );

  return ProtectedRoutes;
};

export const setApiVersion1 = async (api: Application) => {
  await api.register(
    async (apiV1) => {
      await apiV1.register(async (ProtectedRoutes) => {
        await setBearerAuthMiddleware(ProtectedRoutes);

        await setEntitiesPlugins(ProtectedRoutes, ["users", "theaters"]);
      });

      await apiV1.register(async (unprotectedRoutes) => {
        await setTokenGeneratorRoute(unprotectedRoutes);
      });
    },
    { prefix: API_V1_PREFIX }
  );

  logger.trace(`API v1 plugin initialized`);
};
