import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { env } from "../../../setup/env";
import { logger } from "../../../logging/logger";
import { Id, idKey } from "../../../types/general";
import { getCollection } from "../../../DB/databaseConnector";
import { ObjectId, WithId } from "mongodb";
import { FromSchema } from "json-schema-to-ts";
import { Application } from "../../../application";

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

type LoginInput = FromSchema<typeof loginInputJSONSchema>;

const getUser = async (email: string, password: string) => {
  const userCollection = getCollection("users");

  const user = await userCollection.findOne<WithId<LoginInput>>(
    { email },
    {
      projection: {
        email: 1,
        password: 1,
      },
    }
  );

  if (!user) {
    throw {
      message: "Invalid credentials",
      statusCode: StatusCodes.UNAUTHORIZED,
      user: null,
      accessToken: null,
      details: "User not found",
    };
  }

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

const updateUsersSessions = async (
  user: WithId<LoginInput>,
  accessToken: string
) => {
  const userCollection = getCollection("users");

  const updateResult = await userCollection.updateOne(
    { [idKey]: new ObjectId(user[idKey]) },
    { $push: { sessions: { accessToken } } }
  );

  if (!updateResult.acknowledged) {
    logger.error(`Failed to update user sessions for user ${user.email}`);

    throw {
      message: "Internal server error",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      user: user._id,
      accessToken: null,
      details: "Failed to update user sessions",
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

      const accessToken = createAccessToken({
        id: user._id,
        email,
      });

      await updateUsersSessions(user, accessToken);

      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );

  return app;
};
