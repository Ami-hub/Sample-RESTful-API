import fastifyBearerAuth from "@fastify/bearer-auth";
import { requestContext } from "@fastify/request-context";
import { sign, verify } from "jsonwebtoken";

import { Application } from "../../../application";
import { logger } from "../../../logging/logger";
import { IdType } from "../../../models/id";
import { env } from "../../../setup/env";
import { User } from "../../../models/user";

declare module "@fastify/request-context" {
  interface RequestContextData {
    userId: IdType;
  }
}

type UserRole = User["role"];
type UserEmail = User["email"];

export type JWTUserTokenPayload = {
  userId: IdType;
  email: UserEmail;
  role: UserRole;
};

export const createAccessToken = (userDetails: JWTUserTokenPayload) =>
  sign(userDetails, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRES_MINUTES}m`,
  });

const verifyAccessToken = (token: string) => verify(token, env.JWT_SECRET);

const getUserDetailsFromAccessToken = (
  token: string
): JWTUserTokenPayload | undefined => {
  try {
    const payload = verifyAccessToken(token);
    if (typeof payload !== "object") {
      return;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
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

export const setBearerAuthMiddleware = async (
  protectedRoutes: Application,
  allowedRoles: UserRole[] = ["admin"]
) => {
  await protectedRoutes.register(fastifyBearerAuth, {
    keys: new Set([env.JWT_SECRET]),
    auth(key) {
      const userDetails = getUserDetailsFromAccessToken(key);
      if (!userDetails) return false;

      if (allowedRoles && !allowedRoles.includes(userDetails.role)) {
        return false;
      }

      requestContext.set("userId", userDetails.userId);
      return true;
    },

    errorResponse: () => {
      return { error: "Unauthorized" };
    },
  });
};
