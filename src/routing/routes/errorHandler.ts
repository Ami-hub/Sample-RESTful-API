import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { toStatusError } from "../../types/statusError";

export const deferToErrorMiddleware = (
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

export const errorHandler = <T extends Error>(
  err: T,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusError = toStatusError(err);

  res.status(statusError.status).send({
    error: statusError.message,
  });
};
