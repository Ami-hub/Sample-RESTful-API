import { z } from "zod";
import { accountSchema, productsSchema } from "../validators/accountValidators";

/**
 * Represents a product name.
 *
 * @example
 * ```ts
 * const productName: ProductName = "CurrencyService";
 * ```
 */
export type ProductName = z.infer<typeof productsSchema>;

/**
 * Represents an account.
 *
 * @property `_id` - The unique identifier for the account.
 * @property `account_id` - The account ID number (5 digits).
 * @property `limit` - The credit limit for the account.
 * @property `products` - An array of product names associated with the account.
 *
 * @example
 * ```ts
 * const account = {
 *   _id: new ObjectId("643c72cf2fd98fa41ba82445"),
 *   account_id: 433811,
 *   limit: 10000,
 *   products: [
 *     "CurrencyService",
 *     "InvestmentFund",
 *     "Brokerage",
 *     "InvestmentStock"
 *   ]
 * };
 * ```
 */
export type Account = z.infer<typeof accountSchema>;
