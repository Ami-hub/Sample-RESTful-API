import { FromSchema } from "json-schema-to-ts";
import { Theater, getTheaterJSONSchema } from "./theater";
import { User } from "./user";

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
  users: getTheaterJSONSchema(),
};

export type EntityJSONSchemaMap = typeof entityJSONSchemaMap;

export const getEntityJSONSchema = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityJSONSchemaMap[T] => {
  return entityJSONSchemaMap[entityName];
};

/**
 * Filter type

type FilterHelper<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? U extends object
  ? FilterHelper<U>[]
      : T[P]
    : T[P] extends object
    ? FilterHelper<T[P]>
    : T[P];
  };

type Filter<
  T extends EntitiesMapDBWithoutId[keyof EntitiesMapDBWithoutId]
  > = {
    [P in keyof (T & Id)]?: (T & Id)[P] extends (infer U)[]
    ? U extends object
    ? FilterHelper<U>[]
    : (T & Id)[P]
    : (T & Id)[P] extends object
    ? FilterHelper<(T & Id)[P]>
    : (T & Id)[P];
  };
*/

export type Filter<
  T extends EntitiesMapDBWithoutId[keyof EntitiesMapDBWithoutId]
> = {
  [key: string]: any;
};
