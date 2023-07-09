import Fastify from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { fastifyWinstonLogger } from "./logging/logger";

/**
 * The main application instance
 * @see https://www.fastify.io/docs/latest/TypeScript/
 */
const app = Fastify({
  logger: fastifyWinstonLogger,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Fastify instance including the type provider
 */
export type Application = typeof app;

export const getApplicationInstance = (): Application => app;
