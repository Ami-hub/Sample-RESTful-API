import { stringObjectIdSchema } from "../validators/objectId";
import { z } from "zod";
import { Theater, theaterObjectIdFields } from "./theater";

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
export const idSchema = stringObjectIdSchema;

/**
 * The type of the unique identifier for each entity
 */
export type IdType = z.infer<typeof idSchema>;

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
 * A map of all entities collection names and their types
 */
export type EntitiesMap = {
  [theatersCollectionName]: Theater;
};
