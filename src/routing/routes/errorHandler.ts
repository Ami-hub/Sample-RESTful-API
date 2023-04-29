import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const deferToErrorHandler = (
  Fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(StatusCodes.BAD_REQUEST).json({ error: err.name });
};
