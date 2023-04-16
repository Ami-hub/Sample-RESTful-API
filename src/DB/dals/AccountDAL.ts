import { Account } from "../../types/types";
import { getCollection } from "../mongo/init";

export interface AccountDal {
  /**
   * Create an account
   * @param account the account to create
   * @returns the created account
   */
  create(account: Account): Promise<Account>;

  /**
   * Read an account by its ID
   * @param id the ID of the account to read
   * @returns the account
   */
  read(id: string): Promise<Account>;

  /**
   * Update an account
   * @param id the ID of the account to update
   * @param account the account to update
   * @returns the updated account
   */
  update(id: string, account: Account): Promise<Account>;

  /**
   * Delete an account
   * @param id the ID of the account to delete
   * @returns the deleted account
   * */
  remove(id: string): Promise<Account>;

  /**
   * Read all accounts
   * @returns the array of accounts
   * */
  readAll(): Promise<Account[]>;
}

export interface AccountDalFactory {
  /**
   * Get an account dal
   * @returns an account dal
   * */
  getAccountDal(): Promise<AccountDal>;
}

// Implantation of the AccountDal interface

import { getMongoDal } from "../mongo/mongoDal";

export const getAccountDal = async (): Promise<AccountDal> => {
  const collection = getCollection("accounts");
  return {
    create: async (account) => {
      throw new Error("Not implemented!");
    },
    read: async (id) => {
      throw new Error("Not implemented!");
    },
    update: async (id, account) => {
      throw new Error("Not implemented!");
    },
    remove: async (id) => {
      throw new Error("Not implemented!");
    },
    readAll: async () => {
      throw new Error("Not implemented!");
    },
  };
};
