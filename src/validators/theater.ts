import z from "zod";

export const theaterSchema = z
  .object({
    location: z.object({
      address: z.object({
        street1: z.string(),
        city: z.string(),
        state: z.string(),
        zipcode: z.string(),
      }),
      geo: z.object({
        type: z.enum(["Point"]),
        coordinates: z.tuple([z.number(), z.number()]),
      }),
    }),
  })
  .strict();

const theaterPartialSchema = theaterSchema.partial().refine((data) => {
  Object.keys(data).length === 0, "Must have at least one field";
});

export const getTheaterSchemas = () => {
  return {
    entitySchema: theaterSchema,
    partialSchema: theaterPartialSchema,
  };
};
