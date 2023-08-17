import { verify } from "jsonwebtoken";
import fastifyBearerAuth from "@fastify/bearer-auth";

declare module "@fastify/request-context" {
  interface RequestContextData {
    userId: IdType;
  }
}

import { env } from "../../../setup/env";
import { Application } from "../../../types/application";
import { logger } from "../../../logging/logger";
import { IdType } from "../../../types/general";
import { JWTTokenPayload } from "./tokenGenerator";
import { requestContext } from "@fastify/request-context";

const verifyAccessToken = (token: string) => verify(token, env.JWT_SECRET);

const getUserDetailsFromAccessToken = (token: string) => {
  try {
    const payload = verifyAccessToken(token);
    if (typeof payload !== "object") {
      return undefined;
    }
    return {
      userId: payload.userId,
      email: payload.email,
    } as JWTTokenPayload;
  } catch (error) {
    return undefined;
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
