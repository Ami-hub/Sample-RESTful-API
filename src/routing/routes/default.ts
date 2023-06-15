import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createStatusError } from "../../errorHandling/statusError";

export const getDefaultsRoutes = async () => {
  const notFoundRoutes = (_req: Request, res: Response) => {
    throw createStatusError(
      `no such resource, please refer to the API documentation to see the available routes`,
      StatusCodes.NOT_FOUND
    );
  };

  const welcomeRoutes = (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: "welcome to the API" });
  };

  return {
    notFoundRoutes,
    welcomeRoutes,
  };
};
