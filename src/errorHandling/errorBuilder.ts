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
  const entityName = relatedEntity.slice(0, -1); // make singular

  const generalError = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${entityName}`;
    return toStatusError(message, StatusCodes.INTERNAL_SERVER_ERROR, details);
  };

  const entityNotFoundError = (
    id: IdType,
    details: string | undefined = undefined
  ) => {
    const message = `No such ${entityName} with id '${id}'`;
    return toStatusError(message, StatusCodes.NOT_FOUND, details);
  };

  const entityAlreadyExistsError = (
    relatedOperation: CRUDOperation,
    id: IdType,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${entityName} with id '${id}' because it already exists`;
    return toStatusError(message, StatusCodes.CONFLICT, details);
  };

  const invalidEntityError = (
    relatedOperation: CRUDOperation,
    isFields: boolean = false,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${entityName} because ${
      isFields ? "some fields are" : "it is"
    } invalid`;
    return toStatusError(message, StatusCodes.BAD_REQUEST, details);
  };

  return {
    generalError,
    entityNotFoundError,
    entityAlreadyExistsError,
    invalidEntityError,
    customError,
  };
};
