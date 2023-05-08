import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getEntityErrorBuilder } from "../../errorHandling/errorBuilder";

export const helloRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
};

export const defaultRoutes = (_req: Request, res: Response) => {
  throw getEntityErrorBuilder("transactions").customError(
    StatusCodes.NOT_FOUND,
    "Not Found"
  );
  res.status(StatusCodes.NOT_FOUND).json({ message: "Not Found" });
};
