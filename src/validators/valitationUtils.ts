import * as z from "zod";
import { ObjectId } from "mongodb";
import { BSONError } from "bson";

/**
 * Represents a zod schema for an ObjectId
 * @example
 * ```ts
 * import { ObjectId } from "mongodb";
 *
 * const id = new ObjectId("5f9b9b9b9b9b9b9b9b9b9b9b");
 * const objectId = objectIdSchema.parse(id);
 * console.log(objectId);
 * ```
 */
export const objectIdSchema = z.custom<ObjectId>((value) => {
  try {
    return new ObjectId(value as any);
  } catch (error) {
    throw new BSONError("BSONError: Invalid ObjectId");
  }
});
