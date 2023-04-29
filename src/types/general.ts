import { objectIdSchema } from "../validators/valitationUtils";
import { Account } from "./account";
import { Customer } from "./customer";
import { z } from "zod";
import { Transaction } from "./transactions";

/**
 * The name of the mongo implementation
 */
export const mongoImplementationName = "mongo";

/**
 * The names of all supported implementations
 *
 * Modify this type to add support for more implementations
 * @example
 * export type ImplementationNames = typeof mongoImplementationName | typeof myImplementationName;
 */
export type ImplementationNames = typeof mongoImplementationName;

/**
 * The key name of the unique identifier for each entity
 */
const idKey = "_id";

/**
 * The type of the unique identifier for each entity
 */
export type IdKey = typeof idKey;

/**
 * The schema of the unique identifier for each entity
 */
export const idSchema = objectIdSchema;

/**
 * The type of the unique identifier for each entity
 */
export type IdType = z.infer<typeof idSchema>;

/**
 * The name of the accounts collection
 */
export const accountCollectionName = "accounts";

/**
 * The name of the customers collection
 */
export const customerCollectionName = "customers";

/**
 * The name of the transactions collection
 */
export const transactionCollectionName = "transactions";

/**
 * A map of all entities collection names and their types
 */
export type EntitiesMap = {
  [accountCollectionName]: Account;
  [customerCollectionName]: Customer;
  [transactionCollectionName]: Transaction;
};

/**
 * A union of all entities
 */
export type Entities = EntitiesMap[keyof EntitiesMap];
