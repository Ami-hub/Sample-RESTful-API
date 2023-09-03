import { FromSchema } from "json-schema-to-ts";
import { jsonSchemaString } from "./jsonSchemaHelpers";

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
  type: "object",
  additionalProperties: false,
  properties: {
    $oid: jsonSchemaString,
  },
  required: ["$oid"],
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
