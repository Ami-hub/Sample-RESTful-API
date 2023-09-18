import { FromSchema } from "json-schema-to-ts";

import { idJsonSchema } from "./id";
import {
  jsonSchemaArrayOfStrings,
  jsonSchemaDateTime,
  jsonSchemaEmail,
  jsonSchemaInteger,
  jsonSchemaNumber,
  jsonSchemaString,
  jsonSchemaUri,
} from "./jsonSchemaHelpers";

/**
 * The name of the movies collection
 */
export const movieCollectionName = "movies";

/**
 * The type of the movies collection name
 */
export type MovieCollectionName = typeof movieCollectionName;

const commentsSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    _id: idJsonSchema,
    name: jsonSchemaString,
    email: jsonSchemaEmail,
    text: jsonSchemaString,
    date: jsonSchemaDateTime,
  },
  required: ["_id", "name", "email", "text", "date"],
} as const;

const validGenres = [
  "Horror",
  "Sci-Fi",
  "Drama",
  "History",
  "Romance",
  "Short",
  "Comedy",
  "Family",
  "Sport",
  "Music",
  "Musical",
  "Adventure",
  "Fantasy",
  "Documentary",
  "Crime",
  "Film-Noir",
  "Action",
  "War",
  "Western",
  "Mystery",
  "Thriller",
  "Animation",
  "Biography",
  "Talk-Show",
  "News",
] as const;

const validClassifications = [
  "PASSED",
  "PG-13",
  "APPROVED",
  "TV-PG",
  "TV-14",
  "G",
  "PG",
  "M",
  "R",
  "GP",
  "X",
  "NC-17",
  "TV-MA",
  "TV-G",
  "TV-Y7",
] as const;

const moviesSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  additionalProperties: false,
  properties: {
    plot: jsonSchemaString,
    genres: {
      type: "array",
      items: {
        type: "string",
        enum: validGenres,
      },
    },
    runtime: jsonSchemaInteger,
    classification: {
      type: "string",
      enum: validClassifications,
    },
    cast: jsonSchemaArrayOfStrings,
    poster: jsonSchemaUri,
    title: jsonSchemaString,
    languages: jsonSchemaArrayOfStrings,
    released: jsonSchemaDateTime,
    directors: jsonSchemaArrayOfStrings,
    writers: jsonSchemaArrayOfStrings,
    awards: {
      type: "object",
      additionalProperties: false,
      properties: {
        wins: jsonSchemaInteger,
        nominations: jsonSchemaInteger,
        text: jsonSchemaString,
      },
      required: ["wins", "nominations", "text"],
    },
    lastUpdated: jsonSchemaDateTime,
    year: jsonSchemaInteger,
    imdb: {
      type: "object",
      additionalProperties: false,
      properties: {
        rating: jsonSchemaNumber,
        numReviews: jsonSchemaInteger,
        id: jsonSchemaInteger,
      },
      required: ["rating", "numReviews", "id"],
    },
    countries: jsonSchemaArrayOfStrings,
    type: jsonSchemaString,
    tomatoes: {
      type: "object",
      additionalProperties: false,
      properties: {
        viewer: {
          type: "object",
          additionalProperties: false,
          properties: {
            rating: jsonSchemaNumber,
            numReviews: jsonSchemaInteger,
            meter: jsonSchemaInteger,
          },
          required: ["rating", "numReviews"],
        },
        dvd: jsonSchemaDateTime,
        critic: {
          type: "object",
          additionalProperties: false,
          properties: {
            rating: jsonSchemaNumber,
            numReviews: jsonSchemaInteger,
            meter: jsonSchemaInteger,
          },
          required: ["rating", "numReviews"],
        },
        lastUpdated: jsonSchemaDateTime,
        consensus: jsonSchemaString,
        rotten: jsonSchemaInteger,
        production: jsonSchemaString,
        fresh: jsonSchemaInteger,
        boxOffice: {
          type: "string",
          pattern: "^\\$[0-9]+(\\.[0-9]+)?(k|M)?$",
        },
      },
    },
    comments: {
      type: "array",
      items: commentsSchema,
    },
    metaritic: jsonSchemaInteger,
  },
  required: [
    "genres",
    "title",
    "awards",
    "lastUpdated",
    "year",
    "imdb",
    "type",
  ],
} as const;

/**
 * The JSON schema of the movie entity
 */
export const getMovieJSONSchema = () => moviesSchema;

/**
 * Type of the movie entity
 * 
 * @example
 * ```json
  {
    "title": "The King and I",
    "plot": "A widow accepts a job as a live-in governess to the King of Siam's children.",
    "genres": ["Biography", "Drama", "Musical"],
    "runtime": 133,
    "cast": ["Deborah Kerr", "Yul Brynner", "Rita Moreno", "Martin Benson"],
    "poster": "https://m.media-amazon.com/images/M/MV5BNmJkYTViMzItZDM3YS00MDU2LTkzYWItMGJkYjVjMjU2YjNlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_SY1000_SX677_AL_.jpg",
    "languages": ["English", "Thai"],
    "released": "1956-06-29T00:00:00.000+00:00",
    "directors": ["Walter Lang"],
    "writers": [
      "Ernest Lehman (screenplay)",
      "Oscar Hammerstein II (book)",
      "Margaret Landon (from their musical play based on Anna and the King of Siam by)"
    ],
    "awards": {
      "wins": 13,
      "nominations": 8,
      "text": "Won 5 Oscars. Another 8 wins & 8 nominations."
    },
    "year": 1956,
    "imdb": {
      "rating": 7.5,
      "id": 49408,
      "numReviews": 18067
    },
    "countries": ["USA"],
    "type": "movie",
    "tomatoes": {
      "viewer": {
        "rating": 3.6,
        "numReviews": 60751,
        "meter": 83
      },
      "dvd": "1999-04-27T00:00:00.000Z",
      "critic": {
        "rating": 8.2,
        "numReviews": 25,
        "meter": 96
      },
      "lastUpdated": "2015-09-02T18:58:28.000Z",
      "rotten": 1,
      "production": "20th Century Fox",
      "fresh": 24
    },
    "comments": [
      {
        "_id": "5a9427648b0beebeb69592ae",  
        "name": "Theresa Holmes",
        "email": "theresa_holmes@fakegmail.com",
        "text": "That was...",
        "date": "2008-05-15T22:28:44.000Z"
      }
    ],
    "classification": "G",
    "lastUpdated": "2015-09-14 23:58:15.860000000"
  }
 * ```
 */
export type Movie = FromSchema<typeof moviesSchema>;
