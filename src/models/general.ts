import { FromSchema } from "json-schema-to-ts";
import { Theater, getTheaterJSONSchema } from "./theater";
import { User, getUserJSONSchema } from "./user";

/**
 * Unwraps a promise type
 * @example
 * ```ts
 * type PromiseString = Promise<string>;
 * type str = UnwrapPromise<PromiseString>; // equals to string
 * ```
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

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

const idJSONSchemaAsQueryParam = {
  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: idSchema,
  },
} as const;

/**
 * The schema of the unique identifier for each entity in an object
 */
export const getIdJSONSchemaAsQueryParam = () => idJSONSchemaAsQueryParam;

const paginationOptions = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      limit: { type: "number" },
      offset: { type: "number" },
    },
  } as const,
};

/**
 * The schema of the pagination options, used for getting a subset of entities
 */
export const getPaginationOptionsJSONSchema = () => paginationOptions;

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

/**
 * The name of the transactions collection
 */
export const theatersCollectionName = "theaters";

/**
 * The name of the movies collection
 */
export const moviesCollectionName = "movies";

/**
 * The name of the users collection
 */
export const usersCollectionName = "users";

/**
 * The name of the sessions collection
 */
export const sessionsCollectionName = "sessions";

/**
 * A map of all entities collection names and their types
 */
export type EntitiesMapDBWithoutId = {
  [theatersCollectionName]: Theater;
  [usersCollectionName]: User;
};

/**
 * A map of all entities collection names and their types how they are stored in the database
 */
export type EntitiesMapDB = {
  [T in keyof EntitiesMapDBWithoutId]: EntitiesMapDBWithoutId[T] & Id;
};

const entityJSONSchemaMap = {
  theaters: getTheaterJSONSchema(),
  users: getUserJSONSchema(),
};

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

const getObjectKeys = <T extends object>(obj: T) =>
  Object.keys(obj) as (keyof T)[];

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

type AnyObject = { [key: string]: any };

const toPartialJSONSchemaHelper = (object: AnyObject) => {
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (typeof object[prop] === "object" && object[prop] !== null) {
        toPartialJSONSchemaHelper(object[prop]);
      }
      if (prop === "required") {
        // object["minProperties"] = 1; // TODO: consider adding this
        delete object[prop];
      }
    }
  }

  return object;
};

type PartialEntityJSONSchemaMap = {
  [T in keyof typeof entityJSONSchemaMap]: ToPartialJSONSchema<
    (typeof entityJSONSchemaMap)[T]
  >;
};

const getEntityPartialJSONSchemaMap = (): PartialEntityJSONSchemaMap => {
  const entityPartialMap: any = {};
  getObjectKeys(entityJSONSchemaMap).forEach((k) => {
    entityPartialMap[k] = toPartialJSONSchema(entityJSONSchemaMap[k]);
  });
  return entityPartialMap;
};

const entityPartialJSONSchemaMap: PartialEntityJSONSchemaMap =
  getEntityPartialJSONSchemaMap();

/**
 * A map of all entities collection names and their JSON schemas
 */
export type EntityJSONSchemaMap = typeof entityJSONSchemaMap;

/**
 * A map of all entities collection names and their partial JSON schemas
 */
export type EntityPartialJSONSchemaMap = typeof entityPartialJSONSchemaMap;

/**
 * Gets the JSON schema of an entity
 * @param entityName the name of the entity
 * @returns the JSON schema of the entity
 */
export const getEntityJSONSchema = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityJSONSchemaMap[T] => {
  return entityJSONSchemaMap[entityName];
};

/**
 * Gets the partial JSON schema of an entity
 * @param entityName the name of the entity
 * @returns the partial JSON schema of the entity
 */
export const getEntityPartialJSONSchema = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityPartialJSONSchemaMap[T] => {
  return entityPartialJSONSchemaMap[entityName];
};

// TODO: consider making this more explicit
export type Filter<
  T extends EntitiesMapDBWithoutId[keyof EntitiesMapDBWithoutId]
> = {
  [key: string]: any;
};

export type FilterExplicit<
  E extends EntitiesMapDBWithoutId[keyof EntitiesMapDBWithoutId],
  T = E & Id
> = {
  [K in keyof T]?: T[K] extends object ? FilterExplicitHelper<T[K]> : T[K];
};

type FilterExplicitHelper<T extends object> = {
  [K in keyof T]?: T[K] extends object ? FilterExplicitHelper<T[K]> : T[K];
};
