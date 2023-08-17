import { FromSchema } from "json-schema-to-ts";

const MAXIMUM_NAME_LENGTH = 50;

const userJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: MAXIMUM_NAME_LENGTH },
    email: { type: "string", format: "email" },
    password: { type: "string" },
    role: { type: "string", enum: ["admin", "user"] },
    accessTokens: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["name", "email", "password", "role", "accessTokens"],
} as const;

export const getUserJSONSchema = () => userJSONSchema;

/**
 * Type of the user entity
 *
 * @example
 * ```ts
  const user: User = {
    name: "test",
    email: "test@test.com",
    password: "$2b$10$ITV/R/fmXonjOta/NvCnQetcYCabS1pEniDLyPwv.H3j.YMm1hBLG",
    role: "user",
    accessTokens: [
      "eyJhbGciOiJ...",
      "eyJhbGcLSac..."
    ],
  };
 * ```
 */
export type User = FromSchema<typeof userJSONSchema>;
