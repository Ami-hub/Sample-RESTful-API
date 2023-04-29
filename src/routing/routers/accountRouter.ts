import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { EntitiesDalMap } from "../../DB/entetiesDAL/entetiesDAL";
import { accountCollectionName } from "../../types/general";

export const getAccountRouter = (
  entityDalGetter: <T extends keyof EntitiesDalMap>(
    collectionName: T
  ) => EntitiesDalMap[T]
) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(
    entityDalGetter(accountCollectionName)
  );

  accountsRouter.get("/", accountRoutes.getAllAccounts);

  accountsRouter.get("/:id", accountRoutes.getAccountById);

  accountsRouter.post("/", accountRoutes.createAccount);

  accountsRouter.put("/:id", accountRoutes.updateAccount);

  accountsRouter.delete("/:id", accountRoutes.deleteAccount);

  return accountsRouter;
};
