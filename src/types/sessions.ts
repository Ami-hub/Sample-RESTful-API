import { FromSchema } from "json-schema-to-ts";

const sessionJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",

  type: "object",
  properties: {
    userId: { type: "string" },
    accessToken: { type: "string" },
  },
  required: ["userId", "accessToken"],
  additionalProperties: false,
} as const;

export const getSessionJSONSchema = () => sessionJSONSchema;

/**
 * Type of the sessions
 * @see {@link sessionSchema}
 * @example
 * ```ts
 * const session: Session = {
 *   userId: "5f7f3c8b0b4b3b2d9c7e6d1f",
 *   accessToken: "eyJhbGciOiJ...",
 * };
 * ```
 */
export type Session = FromSchema<typeof sessionJSONSchema>;
