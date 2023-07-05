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
   * @returns id of the created entity instance or null if not created
   */
  create(data: EntitiesMapDBWithoutId[N]): Promise<EntitiesMapDB[N] | null>;

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
   * @returns the updated entity instance or null if not found
   */
  update(
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ): Promise<EntitiesMapDB[N] | null>;

  /**
   * Deletes an entity instance
   * @param id id of the entity instance
   * @returns the deleted entity instance or null it did not delete
   */
  delete(id: IdType): Promise<EntitiesMapDB[N] | null>;
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
    logger.debug(
      `Reading ${limit} ${collectionName} start from ${skip} with filters: ${JSON.stringify(
        filters,
        null,
        4
      )}`
    );

    const result = await collection
      .aggregate<EntitiesMapDB[N]>([
        // Filters are in this format: { $match: { key: value } }, { $match: { key2: value2 } }
        ...filters.map((filter) => ({ $match: filter })),
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    logger.debug(`Found ${result.length} entities from ${collectionName}`);
    return result;
  };

  const create = async (data: EntitiesMapDBWithoutId[N]) => {
    logger.debug(
      `create: ${collectionName} - ${JSON.stringify(data, null, 4)}`
    );
    const result = await collection.insertOne(data);
    if (!result.acknowledged) return null;

    const created = await read(
      [
        {
          [idKey]: result.insertedId,
        },
      ],
      1
    );
    if (!created.length) {
      logger.error(
        `created ${collectionName} - ${JSON.stringify(
          data,
          null,
          4
        )} but could not find it in the DB!`
      );
      return null;
    }

    return created[0];
  };

  const update = async (
    id: IdType,
    data: Partial<EntitiesMapDBWithoutId[N]>
  ) => {
    logger.debug(
      `update: ${collectionName} - ${id} - ${JSON.stringify(data, null, 4)}`
    );
    if (!ObjectId.isValid(id)) return null;
    const asObjectId = new ObjectId(id);
    const toUpdate = await read(
      [
        {
          [idKey]: asObjectId,
        },
      ],
      1
    );
    if (!toUpdate.length) return null;
    const result = await collection.updateOne(
      { [idKey]: asObjectId },
      { $set: data }
    );
    return result.acknowledged ? toUpdate[0] : null;
  };

  const deleteOne = async (id: IdType) => {
    logger.debug(`delete: ${collectionName} - ${id}`);
    if (!ObjectId.isValid(id)) return null;
    const asObjectId = new ObjectId(id);
    const toDelete = await read(
      [
        {
          _id: asObjectId,
        },
      ],
      1
    );
    if (!toDelete.length) return null;
    const result = await collection.deleteOne({ [idKey]: asObjectId });
    return result.acknowledged ? toDelete[0] : null;
  };

  return {
    create,
    read,
    update,
    delete: deleteOne,
  };
};
