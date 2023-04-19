import { Account } from "./account";
import { Customer } from "./customer";

export type IdKey = "_id";

export type EntitiesMap = {
  accounts: Account;
  customers: Customer;
};

export type Entities = EntitiesMap[keyof EntitiesMap];
