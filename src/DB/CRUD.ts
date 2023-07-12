import { ObjectId } from "mongodb";
import {
  EntitiesMapDB,
  EntitiesMapDBWithoutId,
  IdType,
  idKey,
  Filter,
} from "../types/general";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";
import { env } from "../setup/env";

/**
 * Supported CRUD operations
 */
export type CRUDOperation = "read" | "create" | "update" | "delete";

export interface CRUD<N extends keyof EntitiesMapDB> {
  /**
   * Creates a new entity instance
   * @param data data of the entity instance
   * @returns id of the created entity instance or undefined if not created
   */
  create(data: EntitiesMapDBWithoutId[N]): Promise<IdType | undefined>;

  /**
   * Gets all entity instances
   * @param filters filters to apply (intersection between filters)
   * @param limit max amount of entities to return, default is in env
   * @param skip amount of entities to skip, default is 0
   * @returns an array of entity instances
   * @example
   * ```ts
      const usersFound = await getCRUD("users").read([{ 
          key: "email", value: "test@test.com" }], 1);

      console.log(usersFound);

      // Output:
      // [
      //   {
      //     _id: ...,
      //     email: 'test@test.com',
      //     ...
      //   }
      // ]
      ```
    */
  read(
    filters?: Array<Filter<EntitiesMapDB[N]>>,
    limit?: number,
    skip?: number
  ): Promise<Array<EntitiesMapDB[N]>>;

  /**
   * Updates an entity instance
   * @param id id of the entity instance
   * @param data data of the entity instance
   * @returns whether the entity instance was updated or not
   */
  update(
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ): Promise<boolean>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns whether the entity instance was deleted or not
   */
  delete(id: IdType): Promise<boolean>;
}

// ########################################
//             Implementation
// ########################################

export const getCRUD = <N extends keyof EntitiesMapDB>(
  collectionName: N
): CRUD<N> => {
  const collection = getCollection(collectionName);

  const read = async (
    filters: Filter<EntitiesMapDB[N]>[],
    limit: number = env.DEFAULT_READ_LIMIT,
    skip: number = 0
  ) => {
    const result = await collection
      .aggregate<EntitiesMapDB[N]>([
        // Filters are in this format: { $match: { key: value } }, { $match: { key2: value2 } }
        ...filters.map((filter) => ({ $match: filter })),
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    logger.info(`found ${result.length} entities from ${collectionName}`);
    return result;
  };

  const create = async (data: EntitiesMapDBWithoutId[N]) => {
    logger.info(`create: ${collectionName} - ${JSON.stringify(data, null, 4)}`);
    const result = await collection.insertOne(data);
    if (!result.acknowledged) return undefined;

    return result.insertedId.toString();
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ) => {
    logger.info(
      `update: ${collectionName} - ${id} - ${JSON.stringify(data, null, 4)}`
    );
    if (!ObjectId.isValid(id)) return false;
    const result = await collection.updateOne(
      { [idKey]: new ObjectId(id) },
      { $set: data }
    );
    return result.acknowledged;
  };

  const deleteOne = async (id: IdType) => {
    logger.info(`delete: ${collectionName} - ${id}`);
    if (!ObjectId.isValid(id)) return false;
    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
    return result.acknowledged;
  };

  return {
    create,
    read,
    update,
    delete: deleteOne,
  };
};
