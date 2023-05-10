import z from "zod";

const tierAndDetailsIdSchema = z
  .string()
  .length(32)
  .regex(/^[a-zA-Z0-9]+$/); // 32 alphanumeric characters

const tiersSchema = z.enum(["Platinum", "Gold", "Silver", "Bronze"]);

const benefitSchema = z.enum([
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
export const tierAndDetailsSchema = z
  .object({
    tier: tiersSchema,
    benefits: z.array(benefitSchema),
    active: z.boolean(),
    id: tierAndDetailsIdSchema,
  })
  .strict();

/**
 * Zod schema for `customer` object.
 */
export const customerSchema = z
  .object({
    username: z.string(),
    name: z.string(),
    address: z.string(),
    birthdate: z.date(),
    email: z.string().email(),
    active: z.boolean().optional(),
    accounts: z.array(z.number().min(50000)),
    tier_and_details: z.record(tierAndDetailsIdSchema, tierAndDetailsSchema),
  })
  .strict();
