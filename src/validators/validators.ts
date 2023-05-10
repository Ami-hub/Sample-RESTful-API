import { Schema, z } from "zod";
import {
  EntitiesMap,
  IdKey,
  accountCollectionName,
  customerCollectionName,
  idSchema,
  transactionCollectionName,
} from "../types/general";
import { accountSchema } from "./accountValidators";
import { customerSchema } from "./customerValidator";
import { transactionSchema } from "./transactionValidators";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";

const entitySchemaMap: {
  [key in keyof EntitiesMap]: Schema<Omit<EntitiesMap[key], IdKey>>;
} = {
  [accountCollectionName]: accountSchema,
  [customerCollectionName]: customerSchema,
  [transactionCollectionName]: transactionSchema,
};

const entityFieldSchemaMap: {
  [key in keyof EntitiesMap]: Schema<Partial<Omit<EntitiesMap[key], IdKey>>>;
} = {
  [accountCollectionName]: accountSchema.partial(),
  [customerCollectionName]: customerSchema.partial(),
  [transactionCollectionName]: transactionSchema.partial(),
};

/**
 * Get a schema by an entity name
 * @param entity name of the entity
 * @returns a zod schema
 * @see {@link entitySchemaMap}
 */
export const getSchemaByName = <T extends keyof EntitiesMap>(
  entity: T,
  isFieldSchema = false
) => {
  return isFieldSchema ? entityFieldSchemaMap[entity] : entitySchemaMap[entity];
};

/**
 * Get a validator by an entity name
 *
 * @param entity name of the entity
 * @returns a validator function
 * @see {@link entitySchemaMap}
 * @example
 * ```ts
 * const account = { ... };
 * const accountValidator = getValidator(accountCollectionName);
 * const validatedAccount = validator.validate(account);
 * ```
 */
export const getValidator = <T extends keyof EntitiesMap>(entityName: T) => {
  const errorBuilder = getEntityErrorBuilder(entityName);
  return {
    validate: (data: any, action: "create" | "update") => {
      const isFieldSchema = action === "update";
      const schema = getSchemaByName(entityName, isFieldSchema);
      const parseResult = schema.safeParse(data);
      if (!parseResult.success) {
        throw errorBuilder.invalidEntityError(
          action,
          parseResult.error.message
        );
      }
      if (!Object.keys(parseResult.data).length) {
        throw errorBuilder.invalidEntityError(action, "No data provided!");
      }
      return parseResult.data;
    },
  };
};

/**
 * Check if an id is valid
 * @param id id to check
 * @returns true if valid, false otherwise
 */
export const isValidId = (id: IdKey) => {
  return idSchema.safeParse(id).success;
};
