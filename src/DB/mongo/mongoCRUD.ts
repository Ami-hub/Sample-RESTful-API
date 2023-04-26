import { EntitiesMap, IdType, IdKey } from "../../types/general";
import { getCollection } from "./init";
import { CRUD } from "../CRUD";

export const getMongoCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const collection = getCollection(collectionName);

  const readAll = async () => {
    const res = await collection.find<EntitiesMap[T]>({}).toArray();
    return res;
  };

  const readById = async (id: IdType) => {
    const result = await collection.findOne<EntitiesMap[T]>(id);
    return result;
  };

  const readByField = async <K extends keyof EntitiesMap[T]>(
    field: K,
    value: EntitiesMap[T][K]
  ) => {
    const result = await collection.findOne<EntitiesMap[T]>({ [field]: value });
    return result;
  };

  const create = async (data: Omit<EntitiesMap[T], IdKey>) => {
    const result = await collection.insertOne(data);
    return result.acknowledged ? result.insertedId : null;
  };

  const update = async (
    id: IdType,
    data: Partial<Omit<EntitiesMap[T], IdKey>>
  ) => {
    const result = await collection.updateOne({ _id: id }, { $set: data });
    return result.acknowledged ? await readById(id) : null;
  };

  const deleteOne = async (id: IdType) => {
    const toDelete = await readById(id);
    const res = await collection.deleteOne({ _id: id });
    return res.acknowledged ? toDelete : null;
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
