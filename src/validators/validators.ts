import z from "zod";

/* example of a valid account object:

{
    _id: ObjectId("643c72cf2fd98fa41ba82445"),
    account_id: 433811,
    limit: 10000,
    products: [
        "CurrencyService",
        "InvestmentFund",
        "Brokerage",
        "InvestmentStock"
    ]
}
*/

/**
 * Represents an account object.
 * @typedef {Object} Account
 * @property {string} _id - The ID of the account.
 * @property {number} account_id - The account ID.
 * @property {number} limit - The account limit.
 * @property {string[]} products - The array of products associated with the account.
 * 
 * @example
 *```{
        _id: ObjectId("643c72cf2fd98fa41ba82445"),
        account_id: 433811,
        limit: 10000,
        products: [
            "CurrencyService",
            "InvestmentFund",
            "Brokerage",
            "InvestmentStock"
        ]
    }```
*/
export const accountSchema = z.object({
  _id: z.string(),
  account_id: z.number(),
  limit: z.number(),
  products: z.array(z.string()),
});
