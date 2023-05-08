import { Request, Response } from "express";
import http from "http";
import { StatusCodes } from "http-status-codes";

export const helloRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
};

export const defaultRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Not Found" });
};
