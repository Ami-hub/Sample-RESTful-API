import { NextFunction, Request, Response } from "express";
import { toStatusError } from "../../types/statusError";

export const deferToErrorMiddleware =
  (route: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await route(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export const errorHandler = <T extends Error>(
  err: T,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusError = toStatusError(err);

  res.status(statusError.status).json({
    error: statusError.message,
  });
};
