import { IdType, IdKey, ImplementationNames } from "../../types/general";
import { Transaction } from "../../types/transactions";

export interface TransactionDAL {
  readAllTransactions: () => Promise<Transaction[]>;

  readTransactionById: (id: IdType) => Promise<Transaction | null>;

  createTransaction: (data: Omit<Transaction, IdKey>) => Promise<IdType>;

  updateTransaction: (
    id: IdType,
    data: Partial<Omit<Transaction, IdKey>>
  ) => Promise<Transaction>;
}

// ########################################
//             Implementation
// ########################################

export const getTransactionDAL = (
  implementationName: ImplementationNames
): TransactionDAL => {
  throw new Error("Not implemented");
};
