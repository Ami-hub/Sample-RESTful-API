import { createLogger, format, transports } from "winston";
import { Request, Response, NextFunction } from "express";
import morgan, { StreamOptions } from "morgan";

export const logger = createLogger({
  level: "silly", // set the log level to the lowest (silliest) level
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize({
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
    }),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

// Create a stream for morgan to log HTTP requests
const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message);
  },
};

// Use morgan to log HTTP requests
//app.use(morgan("combined", { stream }));
