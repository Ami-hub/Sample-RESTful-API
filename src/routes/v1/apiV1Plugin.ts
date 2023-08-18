import { Application } from "../../application";
import { getEntityPlugin } from "./baseEntityPlugin/entityPlugin";
import { setTokenGeneratorRoute } from "./auth/tokenGenerator";
import { setBearerAuthMiddleware } from "./auth/auth";
import { EntitiesMapDB } from "../../models/entitiesMaps";
import { logger } from "../../logging/logger";

export const API_V1_PREFIX = "/v1";

const setEntitiesPlugins = async <T extends keyof EntitiesMapDB>(
  protectedRoutes: Application,
  entityNames: T[]
) => {
  await Promise.all(
    entityNames.map(async (entityName) => {
      await protectedRoutes.register(getEntityPlugin(entityName), {
        prefix: `/${entityName}`,
      });
    })
  );

  return protectedRoutes;
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
