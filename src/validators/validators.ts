import { Schema } from "zod";
import {
  EntitiesMap,
  IdType,
  idSchema,
  theatersCollectionName,
} from "../types/general";
import { getEntityErrorBuilder } from "../errorHandling/errorBuilder";
import { StatusCodes } from "http-status-codes";
import { getTheaterSchemas } from "./theater";

const entitySchemasMap: {
  [K in keyof EntitiesMap]: () => {
    entitySchema: Schema<EntitiesMap[K]>;
    partialSchema: Schema<Partial<EntitiesMap[K]>>;
  };
} = {
  [theatersCollectionName]: getTheaterSchemas,
};

/**
 * Get a validator by an entity name
 *
 * @param entityName name of the entity
 * @returns a validator function
 * @see {@link entitySchemasMap}
 * @example
 * ```ts
 * const theater = { ... };
 * const theaterValidator = getValidator("theaters");
 * const validatedTheater = validator.validateEntity(theater);
 * await db.create(theater);
 * ```
 */
export const getValidator = <T extends keyof EntitiesMap>(entityName: T) => {
  const errorBuilder: any = getEntityErrorBuilder(entityName); // TODO: set accurate type
  const errorMessages = "Invalid entity field(s)";

  const baseValidator = <E>(data: unknown, schema: Schema<E>): E => {
    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw errorBuilder.invalidFieldStat(
        errorMessages,
        StatusCodes.BAD_REQUEST,
        parseResult.error.message
      );
    }
    return parseResult.data;
  };

  return {
    validateEntity: (data: unknown) => {
      const schema = entitySchemasMap[entityName]().entitySchema;
      return baseValidator(data, schema);
    },

    validateFields: (data: unknown) => {
      const schema = entitySchemasMap[entityName]().partialSchema;
      return baseValidator(data, schema);
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
