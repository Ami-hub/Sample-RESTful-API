import { Db, Collection } from "mongodb";
import { getDbInstance } from "../mongo/init";
import { Entities, EntitiesMap, IdKey, IdType } from "../../types/general";

interface CRUD<T extends Entities> {
  getAll(): Promise<Array<T>>;
  getById(id: IdType): Promise<T | null>;
  create(data: Omit<T, IdKey>): Promise<IdType>;
  update(id: IdType, data: Partial<Omit<T, IdKey>>): Promise<T>;
  delete(id: IdType): Promise<T>;
}

export const getMongoCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const db: Db = getDbInstance();
  const collection: Collection<EntitiesMap[T]> = db.collection(collectionName);

  const getAll = async () => {
    const res = await collection.find().toArray();
    return res as Array<EntitiesMap[T]>;
  };

  const getById = async (id: IdType) => {
    const result = await collection.findOne({ _id: id.id });
    return result as EntitiesMap[T];
  };

  const create = async (data: any) => {
    const insertionResult = await collection.insertOne(data);
    const id = insertionResult.insertedId;
    return id as IdType;
  };

  const update = async (id: IdType, data: any) => {
    const updateResult = await collection.updateOne(
      { _id: id.id },
      { $set: data }
    );
    return await getById(id);
  };

  const deleteOne = async (id: IdType) => {
    const result = await collection.deleteOne({ _id: id.id });
    return await getById(id);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
