import { Id } from "./id";
import { Movie, getMovieJSONSchema, movieCollectionName } from "./movie";
import {
  Theater,
  getTheaterJSONSchema,
  theaterCollectionName,
} from "./theater";
import { User, getUserJSONSchema, userCollectionName } from "./user";

const entityJSONSchemaMap = {
  [theaterCollectionName]: getTheaterJSONSchema(),
  [userCollectionName]: getUserJSONSchema(),
  [movieCollectionName]: getMovieJSONSchema(),
  // Add new entities here
};

/**
 * A map of all entities collection names to their types without an id
 */
export type EntitiesMapDBWithoutId = {
  /*
   I wish I could do:
    ```
    [T in keyof typeof entityJSONSchemaMap]: FromSchema<(typeof entityJSONSchemaMap)[T]>;
    ```
    but it doesn't work due to:
    Expression produces a union type that is too complex to represent.ts(2590)
  */
  [theaterCollectionName]: Theater;
  [userCollectionName]: User;
  [movieCollectionName]: Movie;
  // Add new entities here
};

/**
 * A map of all entities collection names and their types
 */
export type EntitiesMap = {
  [T in keyof EntitiesMapDBWithoutId]: EntitiesMapDBWithoutId[T] & Id;
};

/**
 * A map of all entities collection names and their JSON schemas
 */
export type EntityJSONSchemaMap = typeof entityJSONSchemaMap;

/**
 * Gets a JSON schema of an entity
 * @param entityName a name of an entity
 * @returns the matching JSON schema
 */
export const getEntityJSONSchema = <T extends keyof EntitiesMap>(
  entityName: T
): EntityJSONSchemaMap[T] => entityJSONSchemaMap[entityName];
