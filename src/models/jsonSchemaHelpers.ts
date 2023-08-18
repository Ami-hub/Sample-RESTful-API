/**
 * The type of the pagination options, used for getting a subset of entities
 */
export type ToPartialJSONSchema<T> = {
  [K in keyof T]: K extends "required"
    ? []
    : T[K] extends object
    ? ToPartialJSONSchema<T[K]>
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
): ToPartialJSONSchema<T> =>
  toPartialJSONSchemaHelper(structuredClone(schema)) as ToPartialJSONSchema<T>;
