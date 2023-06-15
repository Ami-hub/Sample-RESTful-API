import { z } from "zod";
import { ObjectId } from "mongodb";

const invalidObjectIdMessage = {
  message: "Invalid ObjectId!",
  path: [],
};

/**
 * Represents a zod schema for an ObjectId string
 */
export const stringObjectIdSchema = z
  .string()
  .refine(ObjectId.isValid, invalidObjectIdMessage);
