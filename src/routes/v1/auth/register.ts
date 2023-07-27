import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { logger } from "../../../logging/logger";
import { getCollection } from "../../../DB/databaseConnector";
import { getUserJSONSchema } from "../../../types/models/user";
import { Application } from "../../../types/application";

const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const initRegisterRoute = async (app: Application) => {
  app.post<{
    Body: {
      email: string;
      password: string;
    };
  }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        } as const,
        response: {
          [StatusCodes.OK]: {
            type: "object",
            additionalProperties: false,
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
          [StatusCodes.BAD_REQUEST]: {
            type: "object",
            additionalProperties: false,
            properties: {
              message: { type: "string" },
              details: { type: "string" },
            },
            required: ["message", "details"],
          },
          [StatusCodes.INTERNAL_SERVER_ERROR]: {
            type: "object",
            additionalProperties: false,
            properties: {
              message: { type: "string" },
              details: { type: "string" },
            },
            required: ["message", "details"],
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const userCollection = getCollection("users");

      const existingUser = await userCollection.findOne(getUserJSONSchema());

      if (existingUser) {
        reply.code(StatusCodes.BAD_REQUEST).send({
          message: "User already exists",
          details: `User with email ${email} already exists`,
        });
        return;
      }

      const passwordHash = await generatePasswordHash(password);

      const insertResult = await userCollection.insertOne({
        email,
        password: passwordHash,
        sessions: [],
      });

      if (!insertResult.acknowledged) {
        logger.error(`Failed to insert user ${email}`);

        reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: "Internal server error",
          details: "Failed to insert user",
        });
        return;
      }

      reply.code(StatusCodes.OK).send({
        message: "User created",
      });
    }
  );
};
