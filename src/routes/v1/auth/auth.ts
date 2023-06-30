import { verify } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../../../setup/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../../../logging/logger";

const unauthorizedErrorMessages = {
  error: "Unauthorized",
};

export const verifyAccessToken = (token: string) =>
  verify(token, env.JWT_SECRET);

export const authorizationMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) => {
  const authHeader = request.headers.authorization;
  logger.debug(`headers: ${JSON.stringify(request.headers)}`);

  if (!authHeader) {
    reply.code(StatusCodes.UNAUTHORIZED).send(unauthorizedErrorMessages);
    done(
      new Error(
        `Authorization header not found in request: ${JSON.stringify(
          request
        )} from ip ${request.ip}`
      )
    );
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    reply.code(StatusCodes.UNAUTHORIZED).send(unauthorizedErrorMessages);
    done();
    return;
  }

  try {
    const user = verifyAccessToken(token);
    logger.debug(`user: ${JSON.stringify(user)}`);
    //request.user = user;
  } catch (err) {
    logger.error(`Error verifying token: ${err}`);
    reply.code(StatusCodes.UNAUTHORIZED).send(unauthorizedErrorMessages);
  }

  done();
};
