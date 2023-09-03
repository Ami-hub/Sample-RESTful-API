import { FromSchema } from "json-schema-to-ts";
import {
  jsonSchemaArrayOfStrings,
  jsonSchemaEmail,
  jsonSchemaString,
} from "./jsonSchemaHelpers";

export const usersCollectionName = "users";

const MAXIMUM_NAME_LENGTH = 40;

const validRoles = ["admin", "user"] as const;

const userJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      maxLength: MAXIMUM_NAME_LENGTH,
    } as const,
    email: jsonSchemaEmail,
    password: jsonSchemaString,
    role: { type: "string", enum: validRoles },
    accessTokens: jsonSchemaArrayOfStrings,
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
