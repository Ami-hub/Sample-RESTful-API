import { Id } from "./id";
import {
  Theater,
  getTheaterJSONSchema,
  theaterCollectionName,
} from "./theater";
import { User, getUserJSONSchema, userCollectionName } from "./user";

/**
 * A map of all entities collection names to their types
 */
export type EntitiesMapDBWithoutId = {
  [theaterCollectionName]: Theater;
  [userCollectionName]: User;
  // Add new entities here
};

const entityJSONSchemaMap = {
  [theaterCollectionName]: getTheaterJSONSchema(),
  [userCollectionName]: getUserJSONSchema(),
  // Add new entities here
};

/**
 * A map of all entities collection names and their types how they are stored in the database
 */
export type EntitiesMapDB = {
  [T in keyof EntitiesMapDBWithoutId]: EntitiesMapDBWithoutId[T] & Id;
};

/**
 * A map of all entities collection names and their JSON schemas
 */
export type EntityJSONSchemaMap = typeof entityJSONSchemaMap;

/**
 * Gets the JSON schema of an entity
 * @param entityName the name of the entity
 * @returns the JSON schema of the entity
 */
export const getEntityJSONSchema = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityJSONSchemaMap[T] => entityJSONSchemaMap[entityName];
