import { StatusCodes } from "http-status-codes";

import { getUserDAL } from "../../../DB/DALs/userDAL";
import { Application } from "../../../application";
import { idKey } from "../../../models/id";
import { createAccessToken, setBearerAuthMiddleware } from "../auth/auth";
import { getBaseEntityPlugin } from "./baseEntityPlugin";

const tokenGeneratorInputJSONSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

const userRoutesPrefix = `/users`;

export const setUserPlugin = async (app: Application) => {
  const userDal = getUserDAL();

  await app.register(
    async (adminPanel) => {
      await setBearerAuthMiddleware(adminPanel, [`admin`]);
      await adminPanel.register(getBaseEntityPlugin(userDal));
    },
    { prefix: userRoutesPrefix }
  );

  app.post(
    `${userRoutesPrefix}/token`,
    {
      schema: {
        body: tokenGeneratorInputJSONSchema,
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await userDal.findCredentials(email, password);

      const userId = user[idKey].toString();

      const accessToken = createAccessToken({
        userId,
        role: user.role,
        email,
      });

      await userDal.updateLastTokenInfo(userId, {
        ip: request.ip,
        userAgent: request.headers["user-agent"],
      });

      reply.code(StatusCodes.OK).send({ accessToken });
    }
  );
};
