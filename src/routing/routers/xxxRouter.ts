import { Router } from "express";
import { getXxxRoutes } from "../routes/xxxRoutes";
import { deferToErrorMiddleware } from "../../errorHandling/errorHandler";

export const getXxxRouter = (
  entityDalGetter: any // TODO: set accurate type
) => {
  const accountsRouter = Router();

  const xxxRoutes = getXxxRoutes(entityDalGetter);

  accountsRouter.get("/", deferToErrorMiddleware(xxxRoutes.getAll));

  accountsRouter.get("/:id", deferToErrorMiddleware(xxxRoutes.getById));

  accountsRouter.post("/", deferToErrorMiddleware(xxxRoutes.create));

  accountsRouter.put("/:id", deferToErrorMiddleware(xxxRoutes.update));

  accountsRouter.delete("/:id", deferToErrorMiddleware(xxxRoutes.delete));

  return accountsRouter;
};
