import {
  ToPartialJSONSchema,
  getObjectKeys,
  toPartialJSONSchema,
} from "./jsonSchemaHelpers";
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

export const entityPartialJSONSchemaMap = getEntityPartialJSONSchemaMap();

/**
 * A map of all entities collection names and their partial JSON schemas
 */
export type EntityPartialJSONSchemaMap = typeof entityPartialJSONSchemaMap;

/**
 * Gets the partial JSON schema of an entity
 * @param entityName the name of the entity
 * @returns the partial JSON schema of the entity
 */
export const getEntityPartialJSONSchema = <T extends keyof EntitiesMapDB>(
  entityName: T
): EntityPartialJSONSchemaMap[T] => entityPartialJSONSchemaMap[entityName];
