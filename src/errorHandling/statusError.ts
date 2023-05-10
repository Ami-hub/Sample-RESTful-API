import { StatusCodes } from "http-status-codes";

/**
 * An error with a status code.
 */
export interface StatusError extends Error {
  status: StatusCodes;
  details?: string;
}

const findKeyInAnyDepth = (obj: any, key: string): any => {
  for (const k in obj) {
    if (k === key) {
      return obj[k];
    } else if (typeof obj[k] === "object") {
      const result = findKeyInAnyDepth(obj[k], key);
      if (result !== undefined) {
        return result;
      }
    }
  }
  return undefined;
};

/**
 * Converts an error to a status error.
 *
 * @param error The error to convert.
 * @param details
 * @returns The status error.
 */
export const errorToStatusError = <T extends StatusError>(
  error: T,
  details: string | undefined = undefined
): StatusError => {
  return {
    name: error.name,
    message: error.message,
    status: error.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
    details: error.details,
  };
};

/**
 * Builds a status error.
 *
 * @param message The error to convert.
 * @param status The status code to use.
 * @param details
 * @returns The status error.
 */
export const createStatusError = (
  message: string,
  status: StatusCodes,
  details: string | undefined = undefined
): StatusError => {
  return {
    name: "Error",
    message,
    status,
    details,
  };
};
