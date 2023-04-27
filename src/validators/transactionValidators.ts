import z from "zod";
import { idSchema } from "../types/general";

/**
 * Zod schema for an accurate number.
 */
const accurateNumberSchema = z.string().regex(/[0-9]+(\.[0-9]+)?/);

/**
 * Zod schema for a transaction code.
 */
const transactionCodeSchema = z.enum(["sell", "buy"]);

/**
 * Zod schema for a ticker symbol.
 */
const tickerSymbol = z.string().regex(/[a-z0-9]+/);

/**
 * Zod schema for a transaction object.
 */
export const singleTransactionSchema = z.object({
  date: z.date(),
  amount: z.number(),
  transaction_code: transactionCodeSchema,
  symbol: tickerSymbol,
  price: accurateNumberSchema,
  total: accurateNumberSchema,
});

/**
 * Zod schema for a transaction document how it is stored in the database.
 */
export const transactionSchema = z.object({
  _id: idSchema,
  account_id: z.number().min(10000).max(Number.MAX_SAFE_INTEGER),
  transaction_count: z.number().positive(),
  bucket_start_date: z.date(),
  bucket_end_date: z.date(),
  transactions: z.array(singleTransactionSchema),
});
