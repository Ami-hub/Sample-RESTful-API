import { z } from "zod";
import {
  singleTransactionSchema,
  transactionSchema,
} from "../validators/transactionValidators";

/**
 * Type for a single transaction object.
 *
 * @property `date` - The date of the transaction.
 * @property `amount` - The amount of shares bought or sold.
 * @property `transaction_code` - The type of the transaction, either "buy" or "sell".
 * @property `symbol` - The ticker symbol of the stock.
 * @property `price` - The price of the stock at the time of the transaction.
 * @property `total` - The total price of the transaction.
 * 
 * @example
 * ```ts
 * const transaction: SingleTransaction = 
    {
      date: new Date("2013-01-02T00:00:00.000Z"),
      amount: 4908,
      transaction_code: "buy",
      symbol: "crm",
      price: "42.51431226552676889696158468723297119140625",
      total: "208660.2445992053817462874576",
    }
 * ```
 */
export type SingleTransaction = z.infer<typeof singleTransactionSchema>;

/**
 * Type for a transaction object.
 *
 * @property `_id` - The unique identifier of the transaction.
 * @property `account_id` - The unique identifier of the account.
 * @property `transaction_count` - The number of transactions in the bucket.
 * @property `bucket_start_date` - The start date of the bucket.
 * @property `bucket_end_date` - The end date of the bucket.
 * @property `transactions` - An array of single transactions.
 * @see {@link SingleTransaction}
 *
 * @example
 * ```ts
 * const transaction: Transaction =
 * {
 *  _id: new ObjectId("5ca4bbc1a2dd94ee58161d6f"),
 *  account_id: 183400,
 *  transaction_count: 1,
 *  bucket_start_date: new Date("2010-02-14T00:00:00.000Z"),
 *  bucket_end_date: new Date("2013-05-24T00:00:00.000Z"),
 *  transactions: [
 *    {
 *       date: new Date("2013-01-02T00:00:00.000Z"),
 *       amount: 4908,
 *       transaction_code: "buy",
 *       symbol: "crm",
 *       price: "42.51431226552676889696158468723297119140625",
 *       total: "208660.2445992053817462874576",
 *    },
 *    //...
 *   ],
 * }
 * ```
 *
 */
export type Transaction = z.infer<typeof transactionSchema>;
