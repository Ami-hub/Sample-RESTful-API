import {
  ImplementationNames,
  accountCollectionName,
  customerCollectionName,
  transactionCollectionName,
} from "../../types/general";
import { AccountDAL, getAccountDAL } from "./accountDAL";
import { CustomerDAL, getCustomerDAL } from "./customerDAL";
import { TransactionDAL, getTransactionDAL } from "./transactionDAL";

/**
 * Map a collection name to its DAL
 */
export type EntitiesDalMap = {
  [accountCollectionName]: AccountDAL;
  [customerCollectionName]: CustomerDAL;
  [transactionCollectionName]: TransactionDAL;
};

const entitiesDALMap: {
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
 *
 * @param implementationName The name of the implementation
 * @param collectionName The name of the collection
 * @returns The DAL of the given entity
 * @throws if the collection name is invalid
 */
export const getEntityDal = <T extends keyof EntitiesDalMap>(
  implementationName: ImplementationNames,
  collectionName: T
): EntitiesDalMap[T] => {
  const entitiesDALCreator = entitiesDALMap[collectionName];
  return entitiesDALCreator(implementationName);
};
