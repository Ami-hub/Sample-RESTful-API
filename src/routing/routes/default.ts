import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createStatusError } from "../../errorHandling/statusError";

export const helloRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
};

export const defaultRoutes = (_req: Request, res: Response) => {
  throw createStatusError("no such resource", StatusCodes.NOT_FOUND);
};
