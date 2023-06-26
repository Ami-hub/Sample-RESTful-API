import { sign, verify } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { env } from "../../../setup/env";
import { FastifyReply, FastifyRequest } from "fastify";

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
  throw new Error("authMiddleware not implemented");
};

export const login =
  () =>
  async (
    request: FastifyRequest,
    reply: FastifyReply,
    done: (err?: Error) => void
  ) => {
    throw new Error("login route not implemented");
  };

const getPasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
