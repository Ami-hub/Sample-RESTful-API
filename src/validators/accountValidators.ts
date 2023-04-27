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
  account_id: z.number().min(10000).max(Number.MAX_SAFE_INTEGER),
  limit: z.number().positive(),
  products: z.array(productsSchema),
});
