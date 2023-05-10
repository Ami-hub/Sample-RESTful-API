import { StatusCodes } from "http-status-codes";
import { EntitiesMap, IdType } from "../types/general";
import { CRUDOperation } from "../DB/CRUD";
import { toStatusError } from "./statusError";

/**
 * Creates a custom error.
 *
 * @Note Do not use this function to create errors related to entities. **Use the {@link getEntityErrorBuilder} function instead.**
 * @param status the status code of the error
 * @param message the message of the error
 * @param details the details of the error
 * @returns a custom error
 * @example
 * ```ts
 * customError(StatusCodes.NOT_FOUND, "No such resource", `No such resource ${resourceName} not exist`);
 * ```
 */
export const customError = (
  status: StatusCodes,
  message: string,
  details: string | undefined = undefined
) => {
  return toStatusError(message, status, details);
};

export const getEntityErrorBuilder = <T extends keyof EntitiesMap>(
  relatedEntity: T
) => {
  const generalError = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${relatedEntity}`;
    return toStatusError(message, StatusCodes.INTERNAL_SERVER_ERROR, details);
  };

  const entityNotFoundError = (
    fieldName: string,
    value: string,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to find ${relatedEntity} with ${fieldName} '${value}'`;
    return toStatusError(message, StatusCodes.NOT_FOUND, details);
  };

  const invalidEntityError = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${relatedEntity}: invalid entity field(s)!`;
    return toStatusError(message, StatusCodes.BAD_REQUEST, details);
  };

  return {
    generalError,
    entityNotFoundError,
    invalidEntityError,
    customError,
  };
};
