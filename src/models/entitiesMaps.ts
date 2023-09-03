import { Id } from "./id";
import {
  Theater,
  getTheaterJSONSchema,
  theatersCollectionName,
} from "./theater";
import { User, getUserJSONSchema, usersCollectionName } from "./user";

/**
 * A map of all entities collection names to their types
 */
export type EntitiesMapDBWithoutId = {
  [theatersCollectionName]: Theater;
  [usersCollectionName]: User;
  // Add new entities here
};

const entityJSONSchemaMap = {
  [theatersCollectionName]: getTheaterJSONSchema(),
  [usersCollectionName]: getUserJSONSchema(),
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
