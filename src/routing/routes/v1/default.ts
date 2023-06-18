import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createStatusError } from "../../errorHandling/statusError";

export const notFoundRoutes = async (_req: Request, _res: Response) => {
  throw createStatusError(`no such endpoint`, StatusCodes.NOT_FOUND);
};

export const welcomeRoutes = async (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Welcome to the API" });
};
