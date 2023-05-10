import winston, { createLogger, format, transports } from "winston";
import { env } from "../env";

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

const logLevelForTest = "error";
const logLevelForDev = "silly";
const logLevelForProd = "info";

const loggerLevel = env.isProd
  ? logLevelForProd
  : env.isTest
  ? logLevelForTest
  : logLevelForDev;

/**
 * Winston logger instance.
 */
export const logger = createLogger({
  level: loggerLevel,
  transports: [new transports.Console()],
  format: loggerFormat,
});
