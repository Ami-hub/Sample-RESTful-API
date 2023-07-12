import { StatusCodes } from "http-status-codes";

/**
 * An error with a status code
 */
export interface ErrorWithStatus extends Error {
  statusCode: StatusCodes;
  details?: string;
}

/**
 * Builds an error with status code
 *
 * @param message an error message
 * @param statusCode the status code to use
 * @param details some details about the error
 * @returns an error with status code
 */
export const createErrorWithStatus = (
  message: string,
  statusCode: StatusCodes,
  details: string | undefined = undefined
): ErrorWithStatus => {
  return {
    name: "Error",
    message,
    statusCode,
    details,
  };
};
