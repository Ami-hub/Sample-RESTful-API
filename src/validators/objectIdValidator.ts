import { z } from "zod";
import { ObjectId } from "mongodb";

/**
 * Represents a zod schema for an ObjectId string
 */
export const objectIdStringSchema = z.string().refine(ObjectId.isValid, {
  message: "Invalid ObjectId!",
  path: [],
});

export const isObjectId = (value: any): value is ObjectId => {
  try {
    new ObjectId(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const objectIdSchema = z.custom<ObjectId>(isObjectId, {
  message: "Invalid ObjectId!",
  path: [],
});
