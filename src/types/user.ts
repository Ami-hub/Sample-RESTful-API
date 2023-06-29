import { FromSchema } from "json-schema-to-ts";

const MAXIMUM_NAME_LENGTH = 50;

const userJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    name: { type: "string", maxLength: MAXIMUM_NAME_LENGTH },
    email: { type: "string", format: "email" },
    password: { type: "string" },
    role: { type: "string", enum: ["admin", "user"] },
  },
  required: ["name", "email", "password", "role"],
  additionalProperties: false,
} as const;

export const getUserJSONSchema = () => userJSONSchema;

/**
 * Type of the user entity
 * @see {@link userSchema}
 *
 * @example
 * ```ts
 * const user: User = {
 *    name: "test",
 *    email: "test@test.com",
 *    password: "$2b$10$ITV/R/fmXonjOta/NvCnQetcYCabS1pEniDLyPwv.H3j.YMmbhBLG",
 *    role: "user",
 * };
 * ```
 */
export type User = FromSchema<typeof userJSONSchema>;
