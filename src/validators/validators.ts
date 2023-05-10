import { Schema } from "zod";
import {
  EntitiesMap,
  IdKey,
  IdType,
  accountCollectionName,
  customerCollectionName,
  idSchema,
  transactionCollectionName,
} from "../types/general";
import { accountSchema } from "./accountValidators";
import { customerSchema } from "./customerValidator";
import { transactionSchema } from "./transactionValidators";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import { toStatusError } from "../errorHandling/statusError";
import { StatusCodes } from "http-status-codes";

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

const getSchemaByName = <T extends keyof EntitiesMap>(entityName: T) => {
  return entitySchemaMap[entityName];
};

const getFieldSchemaByName = <T extends keyof EntitiesMap>(entityName: T) => {
  return entityFieldSchemaMap[entityName];
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
  const errorMessages = "Invalid entity field(s)";
  return {
    validateEntity: (data: any) => {
      const schema = getSchemaByName(entityName);
      const parseResult = schema.safeParse(data);
      if (!parseResult.success) {
        throw toStatusError(
          errorMessages,
          StatusCodes.BAD_REQUEST,
          parseResult.error.message
        );
      }
      return parseResult.data;
    },

    validateFields: (data: any) => {
      const schema = getFieldSchemaByName(entityName);
      const parseResult = schema.safeParse(data);
      if (!parseResult.success) {
        throw toStatusError(
          errorMessages,
          StatusCodes.BAD_REQUEST,
          parseResult.error.message
        );
      }
      if (!Object.keys(parseResult.data).length) {
        throw toStatusError(
          errorMessages,
          StatusCodes.BAD_REQUEST,
          "empty object sent"
        );
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
export const isValidId = (id: IdType) => {
  return idSchema.safeParse(id).success;
};
