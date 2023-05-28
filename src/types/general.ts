import { objectIdStringSchema } from "../validators/objectIdValidator";
import { Account, accountObjectIdFields } from "./account";
import { z } from "zod";

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
export const idSchema = objectIdStringSchema;

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
 * The name of the accounts collection
 */
export const accountCollectionName = "accounts";

/**
 * A map of all entities collection names and their types
 */
export type EntitiesMap = {
  [accountCollectionName]: Account;
};
