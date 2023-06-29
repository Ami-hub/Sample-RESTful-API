import { FromSchema } from "json-schema-to-ts";

const theaterJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    theater: {
      type: "object",
      additionalProperties: false,
      properties: {
        location: {
          type: "object",
          additionalProperties: false,
          properties: {
            address: {
              type: "object",
              additionalProperties: false,
              properties: {
                street1: {
                  type: "string",
                },
                city: {
                  type: "string",
                },
                state: {
                  type: "string",
                },
                zipcode: {
                  type: "string",
                },
              },
              required: ["street1", "city", "state", "zipcode"],
            },
            geo: {
              type: "object",
              additionalProperties: false,
              properties: {
                type: {
                  type: "string",
                },
                coordinates: {
                  type: "array",
                  additionalItems: false,
                  items: [
                    {
                      type: "number",
                    },
                    {
                      type: "number",
                    },
                  ],
                  minItems: 2,
                  maxItems: 2,
                },
              },
              required: ["type", "coordinates"],
            },
          },
          required: ["address", "geo"],
        },
      },
      required: ["location"],
    },
  },
  required: ["theater"],
} as const;

export const getTheaterJSONSchema = () => theaterJSONSchema;

/**
 * Type of the theater entity
 * @see {@link theaterSchema}
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
export type Theater = FromSchema<typeof theaterJSONSchema>;

/**
 * Transaction fields that are of type `ObjectId`
 * @see {@link ObjectId}
 */
export const theaterObjectIdFields: (keyof Theater)[] = [];
