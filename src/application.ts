import Fastify from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { logger } from "./logging/logger";
import { randomBytes } from "crypto";

const requestIdLength = 8;
const generateRequestId = () => randomBytes(requestIdLength).toString("hex");

/**
 * The main application instance
 * @see https://www.fastify.io/docs/latest/TypeScript/
 */
const app = Fastify({
  logger,
  genReqId: generateRequestId,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Fastify instance including the type provider
 */
export type Application = typeof app;

export const getApplicationInstance = (): Application => app;
