import { EntitiesMap, IdType, IdKey, idKey } from "../../types/general";
import { getCollection } from "./init";
import { CRUD } from "../CRUD";
import { ObjectId } from "mongodb";

export const getMongoCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const collection = getCollection(collectionName);

  const readAll = async () => {
    const result = await collection.find<EntitiesMap[T]>({}).toArray();
    return result;
  };

  const readById = async (id: IdType) => {
    const result = await collection.findOne<EntitiesMap[T]>({
      [idKey]: new ObjectId(id),
    });
    return result;
  };

  const readByField = async <K extends keyof EntitiesMap[T]>(
    field: K,
    value: EntitiesMap[T][K]
  ) => {
    const result = await collection
      .find<EntitiesMap[T]>({ [field]: value })
      .toArray();
    return result;
  };

  const create = async (data: Omit<EntitiesMap[T], IdKey>) => {
    const result = await collection.insertOne(data);
    return result.acknowledged ? result.insertedId.toString() : null;
  };

  const update = async (
    id: IdType,
    data: Partial<Omit<EntitiesMap[T], IdKey>>
  ) => {
    const result = await collection.updateOne(
      { [idKey]: new ObjectId(id) },
      { $set: data }
    );
    return result.acknowledged ? await readById(id) : null;
  };

  const deleteOne = async (id: IdType) => {
    const toDelete = await readById(id);
    const result = await collection.deleteOne({ [idKey]: new ObjectId(id) });
    return result.acknowledged ? toDelete : null;
  };

  return {
    readAll,
    readById,
    readByField,
    create,
    update,
    delete: deleteOne,
  };
};
