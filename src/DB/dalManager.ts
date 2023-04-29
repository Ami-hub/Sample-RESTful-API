import { ImplementationNames, mongoImplementationName } from "../types/general";
import { EntitiesDalMap } from "./entetiesDAL/entetiesDAL";
import { getMongoDalManager } from "./mongo/mongoDalManager";

export interface DalManager {
  /**
   * Connect to the database
   * @returns a promise that resolves to the connected DAL manager
   * @NOTE if you have already connected to the DB, this function will do nothing

   */
  connect(): Promise<DalManager>;

  /**
   * Get an entity dal by a collection name name
   * @param collectionName name of the collection
   * @returns an entity dal
   * @example
   * ```ts
   * const dalManager =
   *     await getDalManager(mongoImplementationName).connect();
   *
   * const entityDalGetter = dalManager.getEntityDalByName;
   * const accountsDal = entityDalGetter(accountCollectionName);
   *
   * const accounts = await accountsDal.readAllAccounts();
   * console.log(`I have ${accounts.length} accounts`);
   * ```
   */
  getEntityDalByName<T extends keyof EntitiesDalMap>(
    collectionName: T
  ): EntitiesDalMap[T];

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;
}

const dalManagerMap: {
  [key in ImplementationNames]: () => DalManager;
} = {
  [mongoImplementationName]: getMongoDalManager,
};

export const getDalManager = (
  implementationName: ImplementationNames
): DalManager => {
  const dalManagerCreator = dalManagerMap[implementationName];
  return dalManagerCreator();
};
