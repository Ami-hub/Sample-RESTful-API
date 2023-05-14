import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { createStatusError } from "../../errorHandling/statusError";

/**
 * The standard favicon path
 */
const faviconPath = "/favicon.ico";

export const getDefaultsRoutes = async () => {
  const notFoundRoutes = (_req: Request, res: Response) => {
    throw createStatusError(
      `no such resource, please refer to the API documentation to see the available routes`,
      StatusCodes.NOT_FOUND
    );
  };

  const welcomeRoutes = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: "Welcome to the API" });
  };

  const faviconHandler = (req: Request, res: Response, next: NextFunction) => {
    if (req.url === faviconPath) res.status(204).end();
    else next();
  };

  return {
    notFoundRoutes,
    welcomeRoutes,
    faviconHandler,
  };
};
