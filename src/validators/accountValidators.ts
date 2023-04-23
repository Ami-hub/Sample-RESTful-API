import z from "zod";
import { idSchema } from "../types/general";

/**
 * Zod schema for a product name.
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
 * Zod schema for an account.
 *
 * @example
 * ```ts
 * const parseResult = accountSchema.safeParse(req.body);
 * if (!parseResult.success) throw new Error(parseResult.error);
 * const account: Account = parseResult.data;
 * ```
 */
export const accountSchema = z.object({
  _id: idSchema,
  account_id: z.number().min(100000).max(9007199254740991), // 2^53 - 1, the max safe integer
  limit: z.number().positive(),
  products: z.array(productsSchema),
});
