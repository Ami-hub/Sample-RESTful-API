import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { randomUUID } from "crypto";

/**
 * A middleware for logging HTTP traffic.
 *
 * @param req HTTP request object
 * @param res HTTP response object
 * @param next next middleware function
 */
export const httpTrafficLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = performance.now();
  const reqId = randomUUID();
  const { method, url, body, params, query } = req;

  logger.http(
    `[${method}] REQUEST ${reqId} from ${req.ip} ${url} => with ${
      Object.keys(body).length
        ? `the body: ${JSON.stringify(body, null, 4)}`
        : "no body"
    }${
      Object.keys(params).length
        ? `, params: ${JSON.stringify(params, null, 4)}`
        : ""
    }${
      Object.keys(query).length
        ? `, query: ${JSON.stringify(query, null, 4)}`
        : ""
    }`
  );

  next();
  const executionTime = performance.now() - startTime;
  const contentLength = res.get("Content-Length") || "?";
  const { statusCode } = res;

  logger.http(
    `[${method}] RESPONSE ${reqId} to ${
      req.ip
    } ${url} => ${contentLength} bytes sent with status ${statusCode} in ${executionTime.toFixed(
      3
    )} ms with headers: ${JSON.stringify(res.getHeaders(), null, 4)}`
  );
};
