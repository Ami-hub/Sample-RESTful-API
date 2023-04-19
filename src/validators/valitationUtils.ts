import * as z from "zod";
import { ObjectId } from "mongodb";
import { BSONError } from "bson";

/**
 * Represents a zod schema for an ObjectId.
 *
 * @example
 * ```ts
 * import { ObjectId } from "mongodb";
 * const _id = new ObjectId("5ca4bbcea2dd94ee58162a7a");
 * const parseRes = objectIdSchema.safeParse(_id);
 * if (!parseRes.success)
 *  console.log(parseRes.error);
 *
 * ```
 */

export const objectIdSchema = z.custom<ObjectId>((value) => {
  try {
    return new ObjectId(value as any);
  } catch (error) {
    throw new BSONError("BSONError: Invalid ObjectId");
  }
});
