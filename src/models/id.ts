import { FromSchema } from "json-schema-to-ts";

/**
 * The key name of the unique identifier for each entity
 */
export const idKey = "_id";

/**
 * The type of the unique identifier for each entity
 */
export type IdKey = typeof idKey;

/**
 * The schema of the unique identifier for each entity
 */
export const idJsonSchema = {
  type: "string",
  pattern: "^[0-9a-fA-F]{24}$",
} as const;

/**
 * The type of the unique identifier for each entity
 */
export type IdType = FromSchema<typeof idJsonSchema>;

/**
 * The unique identifier for each entity
 * @see {@link IdType}
 * @see {@link idKey}
 */
export type Id = { [idKey]: IdType };
