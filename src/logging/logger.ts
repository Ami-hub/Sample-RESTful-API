import { LevelWithSilent, pino } from "pino";
import { FastifyBaseLogger } from "fastify";
import pinoPretty from "pino-pretty";

import { env } from "../setup/env";

const createPinoLogger = (level: LevelWithSilent) => {
  const stream = pinoPretty({
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss.l o",
  });

  return pino(
    {
      level,
    },
    stream
  );
};

const logLevel = env.ENABLE_LOGGING ? env.LOG_LEVEL : "silent";

export const logger: FastifyBaseLogger = createPinoLogger(logLevel);
