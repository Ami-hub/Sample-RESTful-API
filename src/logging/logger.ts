import { createLogger, format, transports } from "winston";
import { env } from "../setup/env";
import { FastifyBaseLogger, FastifyLoggerOptions } from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";

const timestampFormat = format.timestamp();

const consoleLoggerFormat = format.combine(
  timestampFormat,
  format.printf(
    (info) =>
      `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}\n`
  ),
  format.colorize({
    all: true,
    colors: {
      error: "red",
      warn: "yellow",
      info: "blue",
      http: "magenta",
      verbose: "cyan",
      debug: "green",
      silly: "gray",
    },
  })
);

const filesLoggerFormat = format.combine(timestampFormat, format.json());

const logLevelForTest = "error";
const logLevelForDev = "silly";
const logLevelForProd = "info";

const loggerLevel = env.isProd
  ? logLevelForProd
  : env.isTest
  ? logLevelForTest
  : logLevelForDev;

const logsDirName = "logs";

/**
 * Winston logger instance.
 */
export const logger = createLogger({
  level: loggerLevel,
  transports: [
    new transports.Console({ format: consoleLoggerFormat }),
    new transports.File({
      dirname: logsDirName,
      filename: "error.log",
      level: "error",
      format: filesLoggerFormat,
    }),
    new transports.File({
      dirname: logsDirName,
      filename: "all.log",
      format: filesLoggerFormat,
    }),
  ],
});

export const fastifyWinstonLogger: FastifyLoggerOptions & PinoLoggerOptions = {
  stream: {
    write: (fastifyLog: string) => {
      const fastifyLogAsJson = JSON.parse(fastifyLog);
      if ("req" in fastifyLogAsJson) {
        logger.http(
          JSON.stringify(
            {
              requestId: fastifyLogAsJson.reqId,
              request: fastifyLogAsJson.req,
            },
            null,
            4
          )
        );
        return;
      }
      if ("res" in fastifyLogAsJson) {
        logger.http(
          JSON.stringify(
            {
              requestId: fastifyLogAsJson.reqId,
              response: {
                ...fastifyLogAsJson.res,
                handlingTimeMs: fastifyLogAsJson.responseTime,
              },
            },
            null,
            4
          )
        );
        return;
      }
      logger.silly(JSON.stringify(fastifyLogAsJson, null, 4));
    },
  },
};
