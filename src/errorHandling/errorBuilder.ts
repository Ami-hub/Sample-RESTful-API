import { StatusCodes } from "http-status-codes";
import { EntitiesMap, IdType } from "../types/general";
import { CRUDOperation } from "../DB/CRUD";
import { toStatusError } from "./statusError";

export const getErrorBuilder = <T extends keyof EntitiesMap>(
  relatedEntity: T
) => {
  const entityName = relatedEntity.slice(0, -1); // make singular

  const customError = (
    status: StatusCodes,
    message: string,
    details: string | undefined = undefined
  ) => {
    return toStatusError(message, status, details);
  };

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
