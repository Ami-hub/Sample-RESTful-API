import { verify } from "jsonwebtoken";
import fastifyBearerAuth from "@fastify/bearer-auth";

import { env } from "../../../setup/env";
import { Application } from "../../../types/application";
import { logger } from "../../../logging/logger";

const verifyAccessToken = (token: string) => verify(token, env.JWT_SECRET);

export const isValidToken = (token: string) => {
  try {
    verifyAccessToken(token);
    return true;
  } catch (error) {
    return false;
  }
};

export const getToken = (authorizationHeader: string | undefined) =>
  authorizationHeader?.split(" ")[1];

export const setBearerAuthMiddleware = async (app: Application) => {
  await app.register(fastifyBearerAuth, {
    keys: new Set([env.JWT_SECRET]),
    auth: isValidToken,
    errorResponse: () => {
      return { error: "Unauthorized" };
    },
  });
};
