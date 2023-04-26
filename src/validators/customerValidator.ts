import z from "zod";
import { idSchema } from "../types/general";

/**
 * Zod schema for `tier and details` id.
 * @example "59ee9884093f41cc94b4b59e81655bf4"
 */
const tierAndDetailsIdSchema = z
  .string()
  .length(32)
  .regex(/^[a-zA-Z0-9]+$/); // 32 alphanumeric characters

/**
 * Zod schema for a `tier`.
 */
export const tiersSchema = z.enum(["Platinum", "Gold", "Silver", "Bronze"]);

/**
 * Zod schema for a `benefit`.
 */
export const benefitSchema = z.enum([
  "sports tickets",
  "24 hour dedicated line",
  "concierge services",
  "dedicated account representative",
  "car rental insurance",
  "airline lounge access",
  "shopping discounts",
  "financial planning assistance",
  "concert tickets",
  "travel insurance",
]);

/**
 * Zod schema for `tier and details` object.
 */
export const tierAndDetailsSchema = z.object({
  tier: tiersSchema,
  benefits: z.array(benefitSchema),
  active: z.boolean(),
  id: tierAndDetailsIdSchema,
});

/**
 * Zod schema for `customer` object.
 */
export const customerSchema = z.object({
  _id: idSchema,
  username: z.string(),
  name: z.string(),
  address: z.string(),
  birthdate: z.date(),
  email: z.string().email(),
  active: z.boolean().optional(),
  accounts: z.array(z.number().min(50000)),
  tier_and_details: z.record(tierAndDetailsIdSchema, tierAndDetailsSchema),
});
