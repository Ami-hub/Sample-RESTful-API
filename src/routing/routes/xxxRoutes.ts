import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { idSchema } from "../../types/general";

export const getXxxRoutes = (
  entityDalGetter: any // TODO: set accurate type
) => {
  const collectionName = "xxx";
  const xxxDAL = entityDalGetter.get(collectionName);
  const getAll = async (_req: Request, res: Response) => {
    const accounts = await xxxDAL.readAllAccounts();
    res.json(accounts);
  };

  const getById = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await xxxDAL.readAccountById(id);
    if (!account) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No such ${collectionName} '${id.toString()}'` });
      return;
    }

    res.json(account);
  };

  const create = async (req: Request, res: Response) => {
    const id = await xxxDAL.create(req.body);
    res.status(StatusCodes.CREATED).json({ "Inserted id": id.toString() });
  };

  const update = async (req: Request, res: Response) => {
    const updated = await xxxDAL.update(req.params.id, req.body);
    res.json(updated);
  };

  const deleteOne = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await xxxDAL.delete(id);
    res.json(account);
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteOne,
  };
};
