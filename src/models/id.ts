import { FromSchema } from "json-schema-to-ts";

/**
 * The key name of the unique identifier for each entity
 */
export const idKey = "_id";

/**
 * The type of the unique identifier for each entity
 */
export type IdKey = typeof idKey;

const idSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "string",
  pattern: "^[0-9a-fA-F]{24}$",
} as const;

/**
 * The schema of the unique identifier for each entity
 */
export const getIdJSONSchema = () => idSchema;

/**
 * The type of the unique identifier for each entity
 */
export type IdType = FromSchema<typeof idSchema>;

/**
 * The unique identifier for each entity
 * @see {@link IdType}
 * @see {@link idKey}
 */
export type Id = { [idKey]: IdType };
