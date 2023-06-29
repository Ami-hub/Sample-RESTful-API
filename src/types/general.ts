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
 * The entity with the unique identifier
 * @see {@link Id}
 */
export type WithId<T extends keyof EntitiesMapDBWithoutId> =
  EntitiesMapDBWithoutId[T] & Id;

/**
 * The entity without the unique identifier
 * @see {@link IdKey}
 */
export type WithoutId<T extends keyof EntitiesMapDB> = Omit<
  EntitiesMapDB[T],
  IdKey
>;

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
  [T in keyof EntitiesMapDBWithoutId]: WithId<T>;
};

/**
 * Filter type for the read operation

 @lastImplementation 
 I gave up on this implementation:
 ```ts
export type Filter<T extends keyof EntitiesMapDB> = Partial<{
  [K in keyof EntitiesMapDB[T]]: {
    [key in keyof EntitiesMapDB[T]]: EntitiesMapDB[T][key];
  }[K];
}>;
```
*/
export type Filter<T extends keyof EntitiesMapDB> =
  | {
      key: string;
      value: any;
    }
  | {};
