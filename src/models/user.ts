import { FromSchema } from "json-schema-to-ts";

import {
  jsonSchemaEmail,
  jsonSchemaString,
  jsonSchemaDateTime,
  jsonSchemaIpAddress,
} from "./jsonSchemaHelpers";

/**
 * The name of the users collection
 */
export const usersCollectionName = "users";

/**
 * The type of the users collection name
 */
export type UserCollectionName = typeof usersCollectionName;

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
    lastTokenInfo: {
      type: "object",
      additionalProperties: false,
      properties: {
        ip: jsonSchemaIpAddress,
        userAgent: jsonSchemaString,
        date: jsonSchemaDateTime,
      },
      required: ["ip", "date"],
    },
  },
  required: ["name", "email", "password", "role"],
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
    lastTokenInfo: {
      ip: "1.2.3.4",
      userAgent: "test",
      date: "2021-01-01T00:00:00.000Z",
    },
  };
 * ```
 */
export type User = FromSchema<typeof userJSONSchema>;
