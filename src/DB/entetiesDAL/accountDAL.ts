import { Account } from "../../types/account";
import {
  IdKey,
  IdType,
  ImplementationNames,
  accountCollectionName,
} from "../../types/general";
import { getCRUD } from "../CRUD";

export interface AccountDAL {
  /**
   * Get all accounts
   * @returns all accounts
   * @example
   * ```ts
   * const accounts = await accountDal.readAll();
   * console.log(`Found ${accounts.length} accounts`);
   * ```
   */
  readAllAccounts(): Promise<Account[]>;

  /**
   * Get an account by id
   * @param id id of the account
   * @returns the account with the given id or null if not found
   * @example
   * ```ts
   * const account = await accountDal.readById(id);
   * console.log(`Account with id ${id} is: ${account}`);
   * ```
   */
  readAccountById(id: IdType): Promise<Account | null>;

  /**
   * Create an account
   * @param data account data
   * @returns id of the created account
   * @example
   * ```ts
   * const anAccount = {...};
   * const id = await accountDal.create(anAccount);
   * console.log(`Account created with id: ${id}`);
   * ```
   *
   */
  createAccount(data: Omit<Account, IdKey>): Promise<IdType>;

  /**
   * Update an account
   * @param id id of the account
   * @param data account data
   * @returns the updated account
   * @example
   * ```ts
   * const account = await accountDal.update(id, {
   * name: "New name",
   * limit: 100000, // new limit
   * });
   * console.log(`Account updated to: ${account}`);
   * ```
   */
  updateAccount(
    id: IdType,
    data: Partial<Omit<Account, IdKey>>
  ): Promise<Account>;

  /**
   * Delete an account
   * @param id id of the account
   * @returns the deleted account
   * @example
   * ```ts
   * const account = await accountDal.delete(id);
   * console.log(`Account deleted: ${account}`);
   * ```
   */
  deleteAccount(id: IdType): Promise<Account>;
}

// ########################################
//             Implementation
// ########################################

export const getAccountDAL = (
  implementationName: ImplementationNames
): AccountDAL => {
  const accountCrud = getCRUD(implementationName, accountCollectionName);

  const readAllAccounts = async () => {
    const accounts = await accountCrud.readAll();
    return accounts;
  };

  const readAccountById = async (id: IdType) => {
    const account = await accountCrud.readById(id);
    return account;
  };

  const createAccount = async (data: Omit<Account, IdKey>) => {
    const id = await accountCrud.create(data);
    if (!id) {
      throw new Error("Failed to create account");
    }
    return id;
  };

  const updateAccount = async (
    id: IdType,
    data: Partial<Omit<Account, IdKey>>
  ) => {
    const updatedAccount = await accountCrud.update(id, data);
    if (!updatedAccount) {
      throw new Error("Failed to update account");
    }
    return updatedAccount;
  };

  const deleteAccount = async (id: IdType) => {
    const deletedAccount = await accountCrud.delete(id);
    if (!deletedAccount) {
      throw new Error("Failed to delete account");
    }
    return deletedAccount;
  };

  return {
    readAllAccounts,
    readAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};
