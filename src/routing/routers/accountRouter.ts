import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { deferToErrorMiddleware } from "../../errorHandling/errorHandler";
import { EntityDalGetter } from "../../types/general";

export const getAccountRouter = (entityDalGetter: EntityDalGetter) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(entityDalGetter);

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
