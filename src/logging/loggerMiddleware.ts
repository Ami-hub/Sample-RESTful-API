import morgan, { StreamOptions } from "morgan";
import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

const httpResponsesLoggerFormat =
  "[:method] RESPONSE to   :remote-addr :url => :res[content-length] bytes sent with status :status in :response-time ms";

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message);
  },
};

/**
 * Morgan middleware for logging HTTP responses.
 */
export const httpResponsesLogger = morgan(httpResponsesLoggerFormat, {
  stream: stream,
});

/**
 * Morgan middleware for logging HTTP requests.
 * @param req HTTP request object
 * @param res HTTP response object
 * @param next next middleware function
 */
export const httpRequestsLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url, body, params, query } = req;
  logger.http(
    `[${method}] REQUEST  from ${
      req.ip
    } ${url} => with the body: ${JSON.stringify(body, null, 4)} ${
      Object.keys(params).length > 0
        ? `params: ${JSON.stringify(params, null, 4)}`
        : ""
    } ${
      Object.keys(query).length > 0
        ? `query: ${JSON.stringify(query, null, 4)}`
        : ""
    }`
  );
  next();
};
