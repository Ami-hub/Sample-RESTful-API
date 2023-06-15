import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createStatusError } from "../../errorHandling/statusError";
import { logger } from "../../logging/logger";

export const notFoundRoutes = async (_req: Request, res: Response) => {
  logger.debug(`im in not found route`);
  throw createStatusError(`no such endpoint`, StatusCodes.NOT_FOUND);
};

export const welcomeRoutes = async (_req: Request, res: Response) => {
  logger.debug(`im in welcome route`);
  res.status(StatusCodes.OK).json({ message: "Welcome to the API" });
};
