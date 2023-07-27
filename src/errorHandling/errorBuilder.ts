import { StatusCodes } from "http-status-codes";
import { EntitiesMapDB, IdType } from "../types/general";
import { CRUDOperation } from "../DB/CRUD";
import { createErrorWithStatus } from "./statusError";

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
 * customError(StatusCodes.NOT_FOUND, "Not found", "The requested resource (${resourceName}) was not found");
 * ```
 */
export const customError = (
  status: StatusCodes,
  message: string,
  details: string | undefined = undefined
) => {
  return createErrorWithStatus(message, status, details);
};

export const getEntityErrorBuilder = <T extends keyof EntitiesMapDB>(
  relatedEntity: T
) => {
  const general = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${relatedEntity}`;
    return createErrorWithStatus(
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      details
    );
  };

  const notFound = (
    fieldName: string,
    value: string,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to find ${relatedEntity} with ${fieldName} '${value}'`;
    return createErrorWithStatus(message, StatusCodes.NOT_FOUND, details);
  };

  const invalidEntityError = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${relatedEntity}: invalid entity field(s)!`;
    return createErrorWithStatus(message, StatusCodes.BAD_REQUEST, details);
  };

  return {
    general,
    notFound,
    invalidEntityError,
    customError,
  };
};
