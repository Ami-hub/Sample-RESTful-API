import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { UserDAL } from "../../../DB/DALs/userDAL";
import { env } from "../../../setup/env";
import { IdType, idKey } from "../../../models/id";
import { Application } from "../../../application";

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

export const setTokenGeneratorRoute = async (
  userDAL: UserDAL,
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

      const user = await userDAL.findCredentials(email, password);

      const userId = user[idKey].toString();

      const accessToken = createAccessToken({
        userId,
        email,
      });
      await userDAL.updateLastTokenInfo(userId, {
        ip: request.ip,
        userAgent: request.headers["user-agent"],
      });

      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );
};
