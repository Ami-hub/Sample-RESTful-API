import { StatusCodes } from "http-status-codes";
import { EntitiesMapDB } from "../models/entitiesMaps";
import { IdType } from "../models/id";
import { CRUDOperation } from "../DB/CRUD";
import { createErrorWithStatus } from "./statusError";

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

  const invalidEntity = (
    relatedOperation: CRUDOperation,
    details: string | undefined = undefined
  ) => {
    const message = `Unable to ${relatedOperation} ${relatedEntity}: invalid entity field(s)!`;
    return createErrorWithStatus(message, StatusCodes.BAD_REQUEST, details);
  };

  return {
    general,
    notFound,
    invalidEntity,
  };
};
