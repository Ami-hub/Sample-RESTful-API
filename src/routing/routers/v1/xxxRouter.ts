import { Router } from "express";
import { getXxxRoutes } from "../../routes/v1/xxxRoutes";
import { deferToErrorMiddleware } from "../../../errorHandling/errorHandler";
import { EntitiesMap } from "../../../types/general";

export const getXxxRouter = (collectionName: keyof EntitiesMap) => {
  const xxxRouter = Router();

  const xxxRoutes = getXxxRoutes(collectionName);

  xxxRouter.get("/", deferToErrorMiddleware(xxxRoutes.getAll));

  xxxRouter.get("/:id", deferToErrorMiddleware(xxxRoutes.getById));

  xxxRouter.post("/", deferToErrorMiddleware(xxxRoutes.create));

  xxxRouter.put("/:id", deferToErrorMiddleware(xxxRoutes.update));

  xxxRouter.delete("/:id", deferToErrorMiddleware(xxxRoutes.delete));

  return xxxRouter;
};
