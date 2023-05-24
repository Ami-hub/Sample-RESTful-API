import { getEntityErrorBuilder } from "../../errorHandling/errorBuilder";
import { Account } from "../../types/account";
import {
  accountCollectionName,
  IdKey,
  IdType,
  ImplementationNames,
} from "../../types/general";
import { getValidator } from "../../validators/validators";
import { getCRUD } from "../CRUD";

export interface AccountDAL {
  /**
   * Get all accounts
   * @returns all accounts
   * @example
   * ```ts
   * const accounts = await accountDal.readAll();
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
   * ```
   *
   */
  createAccount(data: unknown): Promise<Account>;

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
   * ```
   */
  updateAccount(id: IdType, data: unknown): Promise<Account>;

  /**
   * Delete an account
   * @param id id of the account
   * @returns the deleted account
   * @example
   * ```ts
   * const account = await accountDal.delete(id);
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
  const errorBuilder = getEntityErrorBuilder(accountCollectionName);
  const accountValidator = getValidator(accountCollectionName);

  const readAllAccounts = async () => {
    return await accountCrud.readAll();
  };

  const readAccountById = async (id: IdType) => {
    return await accountCrud.readById(id);
  };

  const createAccount = async (data: unknown) => {
    const validAccount = accountValidator.validateEntity(data);
    const id = await accountCrud.create(validAccount);
    if (!id) {
      throw errorBuilder.generalError("create");
    }
    return id;
  };

  const updateAccount = async (id: IdType, data: unknown) => {
    const validAccount = accountValidator.validateFields(data);
    const updatedAccount = await accountCrud.update(id, validAccount);

    if (!updatedAccount) {
      throw errorBuilder.generalError("update");
    }
    return updatedAccount;
  };

  const deleteAccount = async (id: IdType) => {
    const deletedAccount = await accountCrud.delete(id);
    if (!deletedAccount) {
      throw errorBuilder.generalError("delete");
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
