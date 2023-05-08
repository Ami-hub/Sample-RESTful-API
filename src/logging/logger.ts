import winston, { createLogger, format, transports } from "winston";
import morgan, { StreamOptions } from "morgan";
import { Request, Response, NextFunction } from "express";

const { combine, timestamp, printf, colorize } = format;

const colorizer = colorize({
  all: true,
  colors: {
    info: "blue",
    error: "red",
    warn: "yellow",
    http: "magenta",
    verbose: "cyan",
    debug: "green",
    silly: "gray",
  },
});

const formatter = printf((info) => {
  const { timestamp, level, message, ...args } = info;

  return `${timestamp} ${level.toUpperCase()}: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, null, 4) : ""
  }`;
});

const loggerFormat: winston.Logform.Format = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  formatter,
  colorizer
);

export const logger = createLogger({
  level: "silly", // set the log level to the lowest (silliest) level
  transports: [new transports.Console()],
  format: loggerFormat,
});

const httpResponsesLoggerformat =
  "[:method] RESPONSE to   :remote-addr :url => :res[content-length] bytes sent with status :status in :response-time ms";

const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message);
  },
};

/**
 * Morgan middleware for logging HTTP responses.
 */
export const httpResponsesLogger = morgan(httpResponsesLoggerformat, {
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
