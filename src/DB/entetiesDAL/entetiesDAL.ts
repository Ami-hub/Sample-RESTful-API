import {
  ImplementationNames,
  accountCollectionName,
  customerCollectionName,
  transactionCollectionName,
} from "../../types/general";
import { AccountDAL, getAccountDAL } from "./accountDAL";
import { CustomerDAL, getCustomerDAL } from "./customerDAL";
import { TransactionDAL, getTransactionDAL } from "./transactionDAL";

export type EntitiesDalMap = {
  [accountCollectionName]: AccountDAL;
  [customerCollectionName]: CustomerDAL;
  [transactionCollectionName]: TransactionDAL;
};

const entetiesDALMap: {
  [key in keyof EntitiesDalMap]: (
    implementationName: ImplementationNames
  ) => EntitiesDalMap[key];
} = {
  [accountCollectionName]: getAccountDAL,
  [customerCollectionName]: getCustomerDAL,
  [transactionCollectionName]: getTransactionDAL,
};

/**
 * Get the DAL of the given entity
 * @param implementationName The name of the implementation
 * @param collectionName The name of the collection
 * @returns The DAL of the given entity
 * @throws if the collection name is invalid
 */
export const getEntityDal = <T extends keyof EntitiesDalMap>(
  implementationName: ImplementationNames,
  collectionName: T
): EntitiesDalMap[T] => {
  const entetiesDALCreator = entetiesDALMap[collectionName];
  return entetiesDALCreator(implementationName);
};
