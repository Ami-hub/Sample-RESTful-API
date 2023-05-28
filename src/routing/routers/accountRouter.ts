import { Router } from "express";
import { getAccountRoutes } from "../routes/accountRoutes";
import { deferToErrorMiddleware } from "../../errorHandling/errorHandler";
import { PrismaClient } from "@prisma/client";

export const getAccountRouter = (prisma: PrismaClient) => {
  const accountsRouter = Router();

  const accountRoutes = getAccountRoutes(prisma);

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
