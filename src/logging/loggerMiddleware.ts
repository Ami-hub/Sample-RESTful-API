import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { randomUUID } from "crypto";

/**
 * Middleware for logging HTTP traffic
 */
export const httpTrafficLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = performance.now();
  const requestId = randomUUID();

  logger.http({
    type: `request`,
    requestId: requestId,
    method: req.method,
    sourceIP: req.ip,
    url: req.url,
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
  });

  next();
  const executionTime = performance.now() - startTime;
  const contentLength = res.get("Content-Length") || "?"; // TODO - check if this is the correct way to get the content length

  logger.http({
    type: `response`,
    requestId: requestId,
    method: req.method,
    destinationIP: req.ip,
    url: req.url,
    headers: res.getHeaders(),
    status: res.statusCode,
    contentLength: contentLength,
    processingTimeMs: executionTime,
  });
};
