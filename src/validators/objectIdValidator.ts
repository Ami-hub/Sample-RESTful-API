import { z } from "zod";
import { ObjectId } from "mongodb";

/**
 * Represents a zod schema for an ObjectId string
 */
export const objectIdStringSchema = z.string().refine(ObjectId.isValid, {
  message: "Invalid ObjectId!",
  path: [],
});
