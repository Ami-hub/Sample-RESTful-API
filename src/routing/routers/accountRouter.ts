import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { EntitiesDalMap } from "../../DB/entetiesDAL/entetiesDAL";
import { accountCollectionName } from "../../types/general";
import { deferToErrorHandler } from "../routes/errorHandler";

export const getAccountRouter = (
  entityDalGetter: <T extends keyof EntitiesDalMap>(
    collectionName: T
  ) => EntitiesDalMap[T]
) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(
    entityDalGetter(accountCollectionName)
  );

  accountsRouter.get("/", deferToErrorHandler(accountRoutes.getAllAccounts));

  accountsRouter.get("/:id", deferToErrorHandler(accountRoutes.getAccountById));

  accountsRouter.post("/", deferToErrorHandler(accountRoutes.createAccount));

  accountsRouter.put("/:id", deferToErrorHandler(accountRoutes.updateAccount));

  accountsRouter.delete(
    "/:id",
    deferToErrorHandler(accountRoutes.deleteAccount)
  );

  return accountsRouter;
};
