import { z } from "zod";
import { theaterSchema } from "../validators/theater";

/**
 * Type for a theater object.
 * @see https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/#sample_mflix.theaters
 *
 * @example
 * ```ts
  const theater: Theater = {
    location: {
      address: {
        street1: "450 Powell St",
        city: "San Francisco",
        state: "CA",
        zipcode: "94102",
      },
      geo: {
        type: "Point",
        coordinates: [-122.408575, 37.787265],
      },
    },
  }
 * ```
 */
export type Theater = z.infer<typeof theaterSchema>;

/**
 * Transaction fields that are of type `ObjectId`
 * @see {@link ObjectId}
 */
export const theaterObjectIdFields: (keyof Theater)[] = [];
