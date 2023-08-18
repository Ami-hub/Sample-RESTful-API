import { FastifyBaseLogger } from "fastify";
import { requestContext } from "@fastify/request-context";
import { LevelWithSilent, pino } from "pino";
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
      formatters: {
        log: (object) => ({
          ...object,
          userId: requestContext.get("userId"),
        }),
      },
      enabled: env.ENABLE_LOGGING,
    },
    stream
  );
};

export const logger: FastifyBaseLogger = createPinoLogger(env.LOG_LEVEL);
