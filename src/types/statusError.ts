import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { EntitiesMap } from "./general";

/**
 * An error with a status code.
 */
export interface StatusError extends Error {
  status: StatusCodes;
}

/**
 * Converts an error to a status error.
 *
 * @param error The error to convert.
 * @param status The status code to use.
 * @returns The status error.
 *
 * @example
 * ```ts
 * const error = new Error("Something went wrong");
 * const statusError1 = toStatusError(error, StatusCodes.BAD_REQUEST);
 * const errorMsg = "Something went wrong"
 * const statusError2 = toStatusError(errorMsg, StatusCodes.BAD_REQUEST);
 * ```
 */
export const toStatusError = (
  error: string | Error,
  status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  details: string | undefined = undefined
): StatusError => {
  const err = typeof error === "string" ? new Error(error) : error;
  return {
    ...err,
    status,
  };
};

export const customStatusErrorBuilder = (
  status: StatusCodes,
  message: string
) => {
  return toStatusError(message, status);
};

export const statusErrorBuilder = <T extends keyof EntitiesMap>(
  entity: T,
  status: StatusCodes,
  details: string | undefined = undefined
) => {
  return toStatusError(
    `${getReasonPhrase(status)} ${entity} ${details}`,
    status,
    details
  );
};
