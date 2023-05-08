import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { deferToErrorMiddleware } from "../../errorHandling/errorHandler";
import { AccountDAL } from "../../DB/entitiesDAL/accountDAL";

export const getAccountRouter = (accountDAL: AccountDAL) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(accountDAL);

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
