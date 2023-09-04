import { FromSchema } from "json-schema-to-ts";
import { jsonSchemaNumber, jsonSchemaString } from "./jsonSchemaHelpers";

/**
 * The name of the transactions collection
 */
export const theaterCollectionName = "theaters";

/**
 * The type of the transactions collection name
 */
export type TheaterCollectionName = typeof theaterCollectionName;

const geoCoordinatesSchema = {
  type: "array",
  additionalItems: false,
  items: [jsonSchemaNumber, jsonSchemaNumber],
  minItems: 2,
  maxItems: 2,
} as const;

const locationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: {
      type: "object",
      additionalProperties: false,
      properties: {
        zipCode: jsonSchemaString,
        street: jsonSchemaString,
        city: jsonSchemaString,
        state: jsonSchemaString,
        country: jsonSchemaString,
      },
      required: ["street", "city", "state", "zipCode", "country"],
    },
    geoCoordinates: geoCoordinatesSchema,
  },
  required: ["address", "geoCoordinates"],
} as const;

const theaterJSONSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    name: jsonSchemaString,
    location: locationSchema,
  },
  required: ["location", "name"],
} as const;

/**
 * The JSON schema of the theater entity
 */
export const getTheaterJSONSchema = () => theaterJSONSchema;

/**
 * Type of the theater entity
 * 
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
