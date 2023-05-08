import { Customer } from "../../types/customer";
import { IdType, IdKey, ImplementationNames } from "../../types/general";

export interface CustomerDAL {
  readAllCustomers: () => Promise<Customer[]>;

  readCustomerById: (id: IdType) => Promise<Customer | null>;

  createCustomer: (data: Omit<Customer, IdKey>) => Promise<IdType>;

  updateCustomer: (
    id: IdType,
    data: Partial<Omit<Customer, IdKey>>
  ) => Promise<Customer>;

  deleteCustomer: (id: IdType) => Promise<Customer>;
}

// ########################################
//             Implementation
// ########################################

export const getCustomerDAL = (
  implementationName: ImplementationNames
): CustomerDAL => {
  throw new Error("Not implemented");
};
