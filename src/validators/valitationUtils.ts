import * as z from "zod";
import { ObjectId } from "mongodb";
import { BSONError } from "bson";

/**
 * Represents a zod schema for unique identifier of an entity
 */
export const idSchema = z.custom<ObjectId>((value) => {
  try {
    return new ObjectId(value as any);
  } catch (error) {
    throw new BSONError("BSONError: Invalid ObjectId");
  }
});
