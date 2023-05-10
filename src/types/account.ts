import { z } from "zod";
import { accountSchema } from "../validators/accountValidators";
import { Id } from "./general";

/**
 * Represents an account.
 *
 * @property `_id` - The unique identifier for the account.
 * @property `account_id` - The account ID number.
 * @property `limit` - The credit limit for the account.
 * @property `products` - An array of product names associated with the account.
 * @see {@link ProductName}
 *
 * @example
 * ```ts
 * const account: Account = {
 *   _id: myId,
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
export type Account = z.infer<typeof accountSchema> & Id;
