import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

import { env } from "../../../setup/env";
import { IdType, idKey } from "../../../models/id";
import { getCollection } from "../../../DB/databaseConnector";
import { Application } from "../../../application";
import { getEntityDAL } from "../../../DB/entityDAL";
import { createErrorWithStatus } from "../../../errorHandling/statusError";
import { logger } from "../../../logging/logger";

export type JWTTokenPayload = {
  userId: IdType;
  email: string;
};

const createAccessToken = (userDetails: JWTTokenPayload) =>
  sign(userDetails, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRES_MINUTES}m`,
  });

const tokenGeneratorInputJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

const userDAL = getEntityDAL("users");
const getUser = async (email: string, password: string) => {
  const usersFound = await userDAL.get({
    filters: [
      {
        email,
      },
    ],
  });

  if (!usersFound.length) {
    throw createErrorWithStatus(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED,
      `User '${email}' not found`
    );
  }
  const user = usersFound[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createErrorWithStatus(
      "Invalid credentials",
      StatusCodes.UNAUTHORIZED,
      `Invalid password for user '${email}'`
    );
  }

  logger.info(
    `The ${user.role} '${user[idKey]}' logged in with email '${email}'`
  );

  return user;
};

// TODO: should be stored in userDAL!
const addAccessTokenToUser = async (userId: IdType, accessToken: string) => {
  const userCollection = getCollection("users");

  const updateResult = await userCollection.updateOne(
    { [idKey]: new ObjectId(userId) },
    { $push: { accessTokens: accessToken } }
  );

  const massageError = `Failed to update user sessions for user ${userId}`;
  if (!updateResult.acknowledged) {
    throw createErrorWithStatus(
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${massageError}, not acknowledged`
    );
  }

  if (!updateResult.modifiedCount) {
    throw createErrorWithStatus(
      "Internal server error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${massageError}, nothing was modified`
    );
  }

  return true;
};

export const setTokenGeneratorRoute = async (
  unprotectedRoutes: Application
) => {
  unprotectedRoutes.post(
    `/users/token`,
    {
      schema: {
        body: tokenGeneratorInputJSONSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await getUser(email, password);

      const userId = user[idKey].toString();

      const accessToken = createAccessToken({
        userId,
        email,
      });

      await addAccessTokenToUser(userId, accessToken);

      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );
};
