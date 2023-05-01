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
  status: StatusCodes = StatusCodes.BAD_REQUEST,
  details: string | undefined = undefined
): StatusError => {
  const err = typeof error === "string" ? new Error(error) : error;
  return {
    ...err,
    status,
  };
};

type CommonError = "Not Found" | "Bad Request" | "Internal Server Error";

const buildCommonError = <T extends keyof EntitiesMap>(
  error: StatusCodes,
  relatedTo?: T
) => {
  const errorMessage = `${getReasonPhrase(error)} from ${relatedTo}`;
  return toStatusError(errorMessage, error);
};
