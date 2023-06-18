import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { EntitiesMap, idSchema } from "../../../types/general";
import { getEntityDAL } from "../../../DB/entityDAL";

export const getXxxRoutes = (collectionName: keyof EntitiesMap) => {
  const xxxDAL = getEntityDAL(collectionName);

  const getAll = async (_req: Request, res: Response) => {
    const entities = await xxxDAL.getAll();
    res.json(entities);
  };

  const getById = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const entity = await xxxDAL.getById(id);
    if (!entity) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No such ${collectionName} '${id.toString()}'` });
      return;
    }

    res.json(entity);
  };

  const create = async (req: Request, res: Response) => {
    const created = await xxxDAL.create(req.body);
    res.status(StatusCodes.CREATED).json(created);
  };

  const update = async (req: Request, res: Response) => {
    const updated = await xxxDAL.update(req.params.id, req.body);
    res.json(updated);
  };

  const deleteOne = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const deleted = await xxxDAL.delete(id);
    res.json(deleted);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
