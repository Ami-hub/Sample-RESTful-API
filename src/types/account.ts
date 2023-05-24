import { z } from "zod";
import { accountSchema } from "../validators/accountValidators";
import { Id } from "./general";
import { ObjectId } from "mongodb";

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
 *   _id: new ObjectId("60d0fe4f9b589c3d7c8e6e8f"),
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

/**
 * Account fields that are of type `ObjectId`
 * @see {@link ObjectId}
 */
export const accountObjectIdFields: (keyof Account)[] = ["_id"];
