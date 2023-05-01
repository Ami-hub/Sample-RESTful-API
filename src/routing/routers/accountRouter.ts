import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { EntitiesDalMap } from "../../DB/entetiesDAL/entetiesDAL";
import { accountCollectionName } from "../../types/general";
import { deferToErrorMiddleware } from "../routes/errorHandler";

export const getAccountRouter = (
  entityDalGetter: <T extends keyof EntitiesDalMap>(
    collectionName: T
  ) => EntitiesDalMap[T]
) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(
    entityDalGetter(accountCollectionName)
  );

  accountsRouter.get("/", deferToErrorMiddleware(accountRoutes.getAllAccounts));

  accountsRouter.get(
    "/:id",
    deferToErrorMiddleware(accountRoutes.getAccountById)
  );

  accountsRouter.post("/", deferToErrorMiddleware(accountRoutes.createAccount));

  accountsRouter.put(
    "/:id",
    deferToErrorMiddleware(accountRoutes.updateAccount)
  );

  accountsRouter.delete(
    "/:id",
    deferToErrorMiddleware(accountRoutes.deleteAccount)
  );

  return accountsRouter;
};
