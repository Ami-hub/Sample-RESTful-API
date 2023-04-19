import z from "zod";
import { objectIdSchema } from "./valitationUtils";

/**
 * Represents a product name.
 */
export const productsSchema = z.enum([
  "Derivatives",
  "InvestmentStock",
  "Commodity",
  "Brokerage",
  "CurrencyService",
  "InvestmentFund",
]);

/**
 * Zod schema that represent an account.
 *
 * @example
 * ```ts
 * const parseResult = accountSchema.safeParse(req.body);
 * if (!parseResult.success) throw new Error(parseResult.error);
 * const account: Account = parseResult.data;
 * ```
 */
export const accountSchema = z.object({
  _id: objectIdSchema,
  account_id: z.number().min(100000).max(999999),
  limit: z.number().positive(),
  products: z.array(productsSchema),
});
