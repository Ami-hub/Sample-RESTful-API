import { sign, verify } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { env } from "../../../setup/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../../logging/logger";
import { Application } from "../../..";
import { WithId, idKey } from "../../../types/general";
import { getCollection } from "../../../DB/databaseConnector";
import { ObjectId } from "mongodb";

export const createAccessToken = (user: object) => {
  return sign(user, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRES_MINUTES}m`,
  });
};

export const verifyAccessToken = (token: string) =>
  verify(token, env.JWT_SECRET);

export const authMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) => {
  const authHeader = request.headers["authorization"];
  logger.debug(`headers: ${JSON.stringify(request.headers)}`);

  if (!authHeader) {
    return reply.code(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return reply.code(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }

  try {
    const user = verifyAccessToken(token);
    logger.debug(`user: ${JSON.stringify(user)}`);
    //request.user = user;
  } catch (err) {
    logger.error(`Error verifying token: ${err}`);
    return reply.code(StatusCodes.UNAUTHORIZED).send({ error: "Unauthorized" });
  }

  done();
};

export const initLoginRoute = async (app: Application) => {
  app.post(
    "/login",
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
      },
    },
    async (request, reply) => {
      const requestIP = request.ip;

      logger.debug(
        `Email ${request.body.email} is trying to login from ip ${requestIP}`
      );

      const { email, password } = request.body;

      const userCollection = getCollection("users");

      const user = await userCollection.findOne<WithId<"users">>(
        { email },
        { projection: { name: 1, password: 1 } }
      );

      if (!user) {
        logger.debug(`Email ${email} not found from ip ${requestIP}`);
        reply
          .code(StatusCodes.UNAUTHORIZED)
          .send({ error: "Invalid credentials" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logger.debug(
          `Invalid password for email ${email} from ip ${requestIP}`
        );
        return reply
          .code(StatusCodes.UNAUTHORIZED)
          .send({ error: "Invalid credentials" });
      }

      const accessToken = createAccessToken({
        userId: user[idKey],
        email,
      });

      logger.debug(
        `User ${user.email} logged in from ip ${requestIP} successfully`
      );

      const updateResult = await userCollection.updateOne(
        { [idKey]: new ObjectId(user[idKey]) },
        { $push: { sessions: { accessToken } } }
      );

      if (!updateResult.acknowledged) {
        logger.error(
          `Failed to update user sessions for user ${user.email} from ip ${requestIP}`
        );
        reply
          .code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ error: "Internal server error" });
        return;
      }

      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );

  return app;
};

const getPasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
