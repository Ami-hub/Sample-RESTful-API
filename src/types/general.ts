import { FromSchema } from "json-schema-to-ts";
import { Theater } from "./theater";
import { User } from "./user";

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
export const idSchema = {
  type: "string",
  pattern: "^[0-9a-fA-F]{24}$",
} as const;

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
