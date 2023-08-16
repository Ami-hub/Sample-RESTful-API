import { createLogger, format, transports } from "winston";
import { env } from "../setup/env";

const LOGS_DIR_NAME = "logs"; // TODO: move to env

const createCustomLogger = (level: string) => {
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

  const logger = createLogger({
    level,
    silent: !env.ENABLE_LOGGING,
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

  return logger;
};

export const logger = createCustomLogger(env.LOG_LEVEL);

const winstonToPinoLogLevelMap: Record<string, string> = {
  error: "error",
  warn: "warn",
  info: "info",
  http: "info",
  verbose: "debug",
  debug: "debug",
  silly: "trace",
};

const getPinoLogLevel = (winstonLogLevel: string) =>
  winstonToPinoLogLevelMap[winstonLogLevel] ?? "info";

const isRequestLog = (fastifyLogParsed: object) => "req" in fastifyLogParsed;

const isResponseLog = (fastifyLogParsed: object) => "res" in fastifyLogParsed;

export const fastifyWinstonLogger = {
  level: getPinoLogLevel(env.LOG_LEVEL),
  stream: {
    write: (fastifyLog: string) => {
      const fastifyLogAsJson = JSON.parse(fastifyLog);
      if (isRequestLog(fastifyLogAsJson)) {
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

      if (isResponseLog(fastifyLogAsJson)) {
        logger.http(
          JSON.stringify(
            {
              requestId: fastifyLogAsJson.reqId,
              response: fastifyLogAsJson.res,
              handlingTimeMs: fastifyLogAsJson.responseTime,
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
