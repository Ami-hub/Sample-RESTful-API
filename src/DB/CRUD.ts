import { ObjectId } from "mongodb";
import {
  EntitiesMapDB,
  EntitiesMapDBWithoutId,
  Filter,
  IdType,
  idKey,
} from "../types/general";
import { getCollection } from "./databaseConnector";
import { logger } from "../logging/logger";

const DEFAULT_ENTITIES_AMOUNT_PER_REQUEST = 15; // TODO: consider add to env
const DEFAULT_SKIP = 0; // TODO: consider add to env

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
   * @param filters filters to apply (do intersection between them)
   * @param limit max amount of entities to return
   * @param skip amount of entities to skip
   * @returns an array of entity instances
   * @see {@link DEFAULT_ENTITIES_AMOUNT_PER_REQUEST}
   * @see {@link DEFAULT_SKIP}
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
    filters?: Array<Filter<N>>,
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
    filters: Array<Filter<N>> = [{}],
    limit: number = DEFAULT_ENTITIES_AMOUNT_PER_REQUEST,
    skip: number = DEFAULT_SKIP
  ) => {
    logger.debug(
      `Reading ${limit} ${collectionName} start from ${skip} with filters: ${JSON.stringify(
        filters,
        null,
        4
      )}`
    );

    const mongoFilters = filters.map((filter) =>
      "key" in filter ? { [filter.key]: filter.value } : filter
    );
    const result = await collection
      .aggregate<EntitiesMapDB[N]>([
        { $match: { $and: mongoFilters } }, // TODO: consider split to multiple $match (better performance if there are indexes)
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

    const created = await read([{ key: idKey, value: result.insertedId }], 1);
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
          key: idKey,
          value: asObjectId,
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
          key: idKey,
          value: asObjectId,
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
