import { sign, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../../env";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

/**
 * The time in which the access token expires
 */
const expiresIn = "15m";

export const createAccessToken = (user: object) => {
  return sign(user, env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

export const verifyAccessToken = (token: string) =>
  verify(token, env.JWT_SECRET);

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as any)[`user`] = decoded; // TODO: get rid of any 🤮
    next();
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
  }
};

export const login =
  (prisma: PrismaClient) => async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Invalid credentials" });
      return;
    }
    const accessToken = createAccessToken({ id: user.id });
    res.json({ accessToken });
  };

const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
