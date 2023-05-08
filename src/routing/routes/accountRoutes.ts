import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { idSchema } from "../../types/general";
import { accountSchema } from "../../validators/accountValidators";
import { AccountDAL } from "../../DB/entitiesDAL/accountDAL";

export const getAccountRoutes = (accountDal: AccountDAL) => {
  const getAllAccounts = async (_req: Request, res: Response) => {
    const accounts = await accountDal.readAllAccounts();
    res.json(accounts);
  };

  const getAccountById = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await accountDal.readAccountById(id);
    if (account) {
      res.json(account);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No such account '${id.toString()}'` });
    }
  };

  const createAccount = async (req: Request, res: Response) => {
    const account = accountSchema.parse(req.body);
    const id = await accountDal.createAccount(account);
    res.status(StatusCodes.CREATED).json({ "Inserted id": id.toString() });
  };

  const updateAccount = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = req.body;
    const updatedAccount = await accountDal.updateAccount(id, account);
    res.json(updatedAccount);
  };

  const deleteAccount = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await accountDal.deleteAccount(id);
    res.json(account);
  };

  return {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount,
  };
};
