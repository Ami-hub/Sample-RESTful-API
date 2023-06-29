import { FromSchema } from "json-schema-to-ts";

const theaterJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
    },
    location: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: {
          type: "object",
          additionalProperties: false,
          properties: {
            zipCode: {
              type: "string",
            },
            street: {
              type: "string",
            },
            city: {
              type: "string",
            },
            state: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
          required: ["street", "city", "state", "zipCode", "country"],
        },
        geoCoordinates: {
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
      required: ["address", "geoCoordinates"],
    },
  },
  required: ["location", "name"],
} as const;

export const getTheaterJSONSchema = () => theaterJSONSchema;

/**
 * Type of the theater entity
 * @see {@link theaterSchema}
 * @example
 * ```ts
    const theater: Theater = {
      name: "AMC Metreon 16",
      location: {
        address: {
          street: "450 Powell St",
          city: "San Francisco",
          state: "CA",
          country: "USA",
          zipCode: "94103",
        },
        geoCoordinates: [-122.408575, 37.787265],
      },
    };
 * ```
 */
export type Theater = FromSchema<typeof theaterJSONSchema>;

/**
 * Transaction fields that are of type `ObjectId`
 * @see {@link ObjectId}
 */
export const theaterObjectIdFields: (keyof Theater)[] = [];
