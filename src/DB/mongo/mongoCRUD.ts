import {
  EntitiesMap,
  IdType,
  IdKey,
  idKey,
  objectIdsFieldsMap,
} from "../../types/general";
import { getCollection } from "./init";
import { CRUD } from "../CRUD";
import { ObjectId } from "mongodb";
import { isValidId } from "../../validators/validators";
import { isObjectId } from "../../validators/objectIdValidator";

export const getMongoCRUD = <T extends keyof EntitiesMap>(
  collectionName: T
): CRUD<EntitiesMap[T]> => {
  const collection = getCollection(collectionName);

  const readAll = async () => {
    const result = await collection.find<EntitiesMap[T]>({}).toArray();
    return result;
  };

  const readById = async (id: IdType) => {
    if (!isValidId(id)) return null;
    const result = await collection.findOne<EntitiesMap[T]>({
      [idKey]: new ObjectId(id),
    });
    return result;
  };

  const readByField = async <K extends keyof EntitiesMap[T]>(
    field: K,
    value: EntitiesMap[T][K]
  ) => {
    const isObjectIdField = objectIdsFieldsMap[collectionName].includes(field);
    const filter = isObjectIdField
      ? { [field]: new ObjectId(String(value)) }
      : { [field]: value };
    const result = await collection.find<EntitiesMap[T]>(filter).toArray();
    return result;
  };

  const create = async (data: Omit<EntitiesMap[T], IdKey>) => {
    throw new Error("Not implemented!");

    const result = await collection.insertOne(data);
    if (!result.acknowledged) return null;
    return readById(result.insertedId.toString());
  };

  const update = async (
    id: IdType,
    data: Partial<Omit<EntitiesMap[T], IdKey>>
  ) => {
    const toUpdate = await readById(id);
    if (!toUpdate) return null;
    const result = await collection.updateOne(
      { [idKey]: new ObjectId(id) },
      { $set: data }
    );
    return result.acknowledged ? toUpdate : null;
  };

  const deleteOne = async (id: IdType) => {
    const toDelete = await readById(id);
    if (!toDelete) return null;
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
