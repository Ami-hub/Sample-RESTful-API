import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { accountCollectionName, idSchema } from "../../types/general";
import { PrismaClient, User } from "@prisma/client";

export const getAccountRoutes = (prisma: PrismaClient) => {
  const accountDal = prisma.user;

  const getAllAccounts = async (_req: Request, res: Response) => {
    const accounts = await prisma[`user`].findMany();
    res.json(accounts);
  };

  const getAccountById = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await accountDal.findFirst({
      where: { id: id },
    });
    if (!account) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: `No such account '${id.toString()}'` });
      return;
    }

    res.json(account);
  };

  const createAccount = async (req: Request, res: Response) => {
    const created = await accountDal.create(req.body);
    res.status(StatusCodes.CREATED).json(created);
  };

  const updateAccount = async (req: Request, res: Response) => {
    const updatedAccount = await accountDal.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedAccount);
  };

  const deleteAccount = async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const account = await accountDal.delete({
      where: { id: id },
    });

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
