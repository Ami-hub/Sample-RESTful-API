import { verify } from "jsonwebtoken";
import { env } from "../../../setup/env";

const verifyAccessToken = (token: string) => verify(token, env.JWT_SECRET);

export const isValidateToken = (token: string) => {
  try {
    verifyAccessToken(token);
    return true;
  } catch (error) {
    return false;
  }
};
