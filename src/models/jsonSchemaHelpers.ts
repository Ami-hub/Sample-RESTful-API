/*
 * Helper functions and constants for JSON schemas
 */

export const jsonSchemaInteger = { type: "integer" } as const;

export const jsonSchemaNumber = { type: "number" } as const;

export const jsonSchemaString = { type: "string" } as const;

export const jsonSchemaIpAddress = {
  type: "string",
  format: "ipv4",
} as const;

export const jsonSchemaDateTime = {
  type: "string",
  format: "date-time",
} as const;

export const jsonSchemaUri = { type: "string", format: "uri" } as const;

export const jsonSchemaEmail = {
  type: "string",
  format: "email",
} as const;

export const jsonSchemaArrayOfStrings = {
  type: "array",
  items: jsonSchemaString,
} as const;

/**
 * The type of the pagination options, used for getting a subset of entities
 */
export type PartialJSONSchema<T> = {
  [K in keyof T]: K extends "required"
    ? []
    : T[K] extends object
    ? PartialJSONSchema<T[K]>
    : T[K];
};

/**
 * Gets all the keys of an object with the correct type
 */
export const getObjectKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

const toPartialJSONSchemaHelper = (object: object) => {
  getObjectKeys(object).forEach((key) => {
    if (typeof object[key] === "object") toPartialJSONSchemaHelper(object[key]);
    if (key === "required") delete object[key];
  });
  return object;
};

/**
 * Makes all properties of a JSON schema optional
 *
 * @param schema the JSON schema to make its properties optional
 * @returns the JSON schema with all properties optional
 */
export const toPartialJSONSchema = <T extends object>(
  schema: T
): PartialJSONSchema<T> =>
  toPartialJSONSchemaHelper(structuredClone(schema)) as PartialJSONSchema<T>;
