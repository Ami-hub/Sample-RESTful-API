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
 * @param status The status code to use.
 * @param details
 * @returns The status error.
 */
export const toStatusError = (
  error: string | Error,
  status: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  details: string | undefined = undefined
) => {
  const isString = typeof error === "string";
  const message = isString
    ? error
    : findKeyInAnyDepth(error, "message") || error.message || "Unknown error";

  const name = isString ? "Error" : error.name || "Error";
  if (name === "ZodError") {
    status = StatusCodes.BAD_REQUEST;
  }
  const statusError: StatusError = {
    name,
    message,
    status,
    details,
  };

  return statusError;
};
