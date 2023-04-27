import { objectIdSchema } from "../validators/valitationUtils";
import { Account } from "./account";
import { Customer } from "./customer";
import { z } from "zod";
import { Transaction } from "./transactions";

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
 * A map of all entities collection names and their types
 * @example
 * const customer1: EntitiesMap["customers"] = { ... };
 * // equivalent to
 * const customer2: Customer = { ... };
 */
export type EntitiesMap = {
  accounts: Account;
  customers: Customer;
  transactions: Transaction;
};

/**
 * A union of all entities
 */
export type Entities = EntitiesMap[keyof EntitiesMap];
