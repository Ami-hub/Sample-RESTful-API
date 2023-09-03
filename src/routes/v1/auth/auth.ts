import { verify } from "jsonwebtoken";
import fastifyBearerAuth from "@fastify/bearer-auth";

declare module "@fastify/request-context" {
  interface RequestContextData {
    userId: IdType;
  }
}

import { env } from "../../../setup/env";
import { Application } from "../../../application";
import { requestContext } from "@fastify/request-context";

import { logger } from "../../../logging/logger";
import { IdType } from "../../../models/id";
import { JWTTokenPayload } from "./tokenGenerator";

const verifyAccessToken = (token: string) => verify(token, env.JWT_SECRET);

const getUserDetailsFromAccessToken = (
  token: string
): JWTTokenPayload | undefined => {
  try {
    const payload = verifyAccessToken(token);
    if (typeof payload !== "object") {
      return;
    }
    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    logger.error({ error });
    return;
  }
};

export const isValidToken = (token: string) => {
  try {
    verifyAccessToken(token);
    return true;
  } catch (error) {
    return false;
  }
};

export const setBearerAuthMiddleware = async (ProtectedRoutes: Application) => {
  await ProtectedRoutes.register(fastifyBearerAuth, {
    keys: new Set([env.JWT_SECRET]),
    auth(key) {
      const userDetails = getUserDetailsFromAccessToken(key);
      if (!userDetails) return false;

      requestContext.set("userId", userDetails.userId);
      return true;
    },

    errorResponse: () => {
      return { error: "Unauthorized" };
    },
  });
};
