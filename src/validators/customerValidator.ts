import z from "zod";
import { objectIdSchema } from "./valitationUtils";

/**
 * Zod schema for `tier` enum.
 */
export const tiersSchema = z.enum(["Platinum", "Gold", "Silver", "Bronze"]);

/**
 * Zod schema for `tier and details` object.
 */
export const tierAndDetailsSchema = z.object({
  tier: tiersSchema,
  benefits: z.array(z.string()),
  active: z.boolean(),
  id: z.string(),
});

/**
 * Zod schema for `customer` object.
 */
export const customerSchema = z.object({
  _id: objectIdSchema,
  username: z.string(),
  name: z.string(),
  address: z.string(),
  birthdate: z.date(),
  email: z.string().email(),
  active: z.boolean().optional(),
  accounts: z.array(z.number().min(50000)),
  tier_and_details: z.record(
    z
      .string()
      .length(32)
      .regex(/^[a-zA-Z0-9]+$/), // id e.g. "59ee9884093f41cc94b4b59e81655bf4"
    tierAndDetailsSchema
  ),
});
