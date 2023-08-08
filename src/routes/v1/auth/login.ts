import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { FromSchema } from "json-schema-to-ts";

import { env } from "../../../setup/env";
import { logger } from "../../../logging/logger";
import { IdType, idKey } from "../../../types/general";
import { getCollection } from "../../../DB/databaseConnector";
import { Application } from "../../../types/application";
import { getEntityDAL } from "../../../DB/entityDAL";

export const createAccessToken = (user: object) =>
  sign(user, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRES_MINUTES}m`,
  });

const loginInputJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

const getUser = async (email: string, password: string) => {
  const userDAL = getEntityDAL("users");
  const usersFound = await userDAL.get({
    filters: [
      {
        email,
      },
    ],
  });

  if (!usersFound.length) {
    throw {
      message: "Invalid credentials",
      statusCode: StatusCodes.UNAUTHORIZED,
      user: null,
      accessToken: null,
      details: `User '${email}' not found`,
    };
  }
  const user = usersFound[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw {
      message: "Invalid credentials",
      statusCode: StatusCodes.UNAUTHORIZED,
      user: user._id,
      accessToken: null,
      details: "Invalid password",
    };
  }

  return user;
};

const addAccessTokenToUser = async (userId: IdType, accessToken: string) => {
  const userCollection = getCollection("users");

  const updateResult = await userCollection.updateOne(
    { [idKey]: new ObjectId(userId) },
    { $push: { accessTokens: accessToken } }
  );

  if (!updateResult.acknowledged) {
    logger.error(`Failed to update user sessions for user ${userId}`);

    throw {
      message: "Internal server error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      userId,
      accessToken: null,
      details: "Failed to update user sessions",
    };
  }

  if (!updateResult.modifiedCount) {
    logger.error(`Failed to update user sessions for user ${userId}`);

    throw {
      message: "Internal server error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      userId,
      accessToken: null,
      details: "Nothing was updated",
    };
  }

  return true;
};

export const initLoginRoute = async (app: Application) => {
  app.post(
    "/login",
    {
      schema: {
        body: loginInputJSONSchema,
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

  return app;
};
