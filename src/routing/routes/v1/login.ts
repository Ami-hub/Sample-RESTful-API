import { sign, verify } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { env } from "../../../setup/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../../logging/logger";
import { Application } from "../../..";
import { getCRUD } from "../../../DB/CRUD";
import { getUserJSONSchema } from "../../../types/user";

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
        body: getUserJSONSchema(),
      },
    },
    async (request, reply) => {
      logger.debug(`ip: ${request.ip} - body: ${JSON.stringify(request.body)}`);

      const { email, password } = request.body;

      const userCrud = getCRUD("users");

      const userFound = (
        await userCrud.read(
          [
            {
              key: "email",
              value: email,
            },
          ],
          1
        )
      )[0];

      logger.debug(`userFound: ${JSON.stringify(userFound)}`);

      if (!userFound) {
        return reply
          .code(StatusCodes.UNAUTHORIZED)
          .send({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        userFound["password"]
      );
      if (!isPasswordValid) {
        return reply
          .code(StatusCodes.UNAUTHORIZED)
          .send({ error: "Invalid credentials" });
      }

      const accessToken = createAccessToken({ userId: userFound._id, email });

      logger.debug(`userFound ${userFound} created accessToken ${accessToken}`);
      await getCRUD("sessions").create({
        userId: userFound._id,
        accessToken,
      });
      logger.debug(`session created`);
      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );

  return app;
};

const getPasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
