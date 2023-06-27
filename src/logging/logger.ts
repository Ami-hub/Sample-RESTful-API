import { createLogger, format, transports } from "winston";
import { env } from "../setup/env";

const LOGS_DIR_NAME = "logs";

const timestampFormat = format.timestamp();

const logsFormatForConsole = format.combine(
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

const logsFormatForFiles = format.combine(timestampFormat, format.json());

/**
 * Winston logger instance.
 */
export const logger = createLogger({
  level: env.LOG_LEVEL,
  transports: [
    new transports.Console({ format: logsFormatForConsole }),
    new transports.File({
      dirname: LOGS_DIR_NAME,
      filename: "error.log",
      level: "error",
      format: logsFormatForFiles,
    }),
    new transports.File({
      dirname: LOGS_DIR_NAME,
      filename: "all.log",
      format: logsFormatForFiles,
    }),
  ],
});

export const fastifyWinstonLogger = {
  stream: {
    write: (fastifyLog: string) => {
      logger.silly(fastifyLog);
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
      logger.info(fastifyLogAsJson.msg);
    },
  },
};
