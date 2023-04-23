import { Db, Collection } from "mongodb";
import { EntitiesMap, IdType, IdKey } from "../../types/general";
import { getDbInstance } from "./init";
import { CRUD } from "../CRUD";

// TODO: get rid of the casts to any!
// if you have a better idea, please let me know...

export const getMongoCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const db: Db = getDbInstance();
  const collection = db.collection<EntitiesMap[T]>(collectionName);

  const readAll = async () => {
    const res = await collection.find().toArray();
    return res as Array<EntitiesMap[T]>; // TODO: get rid of this cast
  };

  const readById = async (id: IdType) => {
    const result = await collection.findOne(id as any); // TODO: get rid of this cast
    return result as EntitiesMap[T]; // TODO: get rid of this cast
  };

  const create = async (data: Omit<EntitiesMap[T], IdKey>) => {
    const result = await collection.insertOne(data as any); // TODO: get rid of this cast
    return result.insertedId as IdType;
  };

  const update = async (
    id: IdType,
    data: Partial<Omit<EntitiesMap[T], IdKey>>
  ) => {
    await collection.updateOne({ _id: id as any }, { $set: data as any }); // TODO: get rid of this cast
    return await readById(id);
  };

  const deleteOne = async (id: IdType) => {
    const toDelete = await readById(id);
    const res = await collection.deleteOne({ _id: id as any }); // TODO: get rid of this cast
    res.acknowledged
      ? console.log(`Deleted ${res.deletedCount} document(s).`)
      : console.log("Delete failed.");

    return res.acknowledged ? toDelete : null;
  };

  return {
    readAll,
    readById,
    create,
    update,
    delete: deleteOne,
  };
};
