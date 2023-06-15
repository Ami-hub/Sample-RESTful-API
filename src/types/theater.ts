import { z } from "zod";
import { theaterSchema } from "../validators/theater";

/**
 * Type for a theater object.
 * @see https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/#sample_mflix.theaters
 *
 * @example
 * ```ts
    const transaction: Transaction = {
      location: {
        address: {
          street1: "340 W Market",
          city: "Bloomington",
          state: "MN",
          zipcode: "55425",
        },
        geo: {
          type: "Point",
          coordinates: [-93.24565, 44.85466],
        },
      },
    };
 * ```
 *
 */

export type Theater = z.infer<typeof theaterSchema>;
/**
 * Transaction fields that are of type `ObjectId`
 * @see {@link ObjectId}
 */
export const theaterObjectIdFields: (keyof Theater)[] = [];
