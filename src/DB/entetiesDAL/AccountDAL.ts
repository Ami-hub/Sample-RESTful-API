import { Account } from "../../types/account";
import { IdKey, IdType } from "../../types/general";

interface AccountDAL {
  /**
   * Get all accounts
   * @returns all accounts
   * @example
   * ```ts
   * const accounts = await accountDal.readAll();
   * console.log(`Found ${accounts.length} accounts`);
   * ```
   */
  readAll(): Promise<Account[]>;

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
  readById(id: IdType): Promise<Account | null>;

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
   * @throws { Error } if the data represents an invalid account
   */
  create(data: Omit<Account, IdKey>): Promise<IdType>;

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
   * @throws { Error } if the data represents an invalid part of an account
   */
  update(id: IdType, data: Partial<Omit<Account, IdKey>>): Promise<Account>;

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
  delete(id: IdType): Promise<Account>;
}
