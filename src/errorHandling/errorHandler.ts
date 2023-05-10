import { NextFunction, Request, Response } from "express";
import { StatusError, errorToStatusError } from "./statusError";
import { logger } from "../logging/logger";

export const deferToErrorMiddleware =
  (route: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await route(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export const errorHandler = <T extends StatusError>(
  err: T,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.debug(`Before: ${err.message}: (${err.status}) - ${err.details}`);
  const statusError = errorToStatusError(err);
  logger.debug(
    `After conversion: ${statusError.message}: (${statusError.status}) - ${statusError.details}`
  );

  logger.error(
    `Error: ${statusError.message}: (${statusError.status}) - ${statusError.details}`
  );
  res.status(statusError.status).json({
    error: statusError.message,
  });
};
