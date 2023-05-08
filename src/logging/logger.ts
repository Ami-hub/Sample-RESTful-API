import winston, { createLogger, format, transports } from "winston";

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

/**
 * Winston logger instance.
 */
export const logger = createLogger({
  level: "silly", // set the log level to the lowest (silliest) level
  transports: [new transports.Console()],
  format: loggerFormat,
});
