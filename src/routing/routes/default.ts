import { Request, Response } from "express";
import http from "http";
import { StatusCodes } from "http-status-codes";

export const helloRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Hello World" });
};

export const defaultRoutes = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Not Found" });
};

const iconPath =
  "https://cdn.icon-icons.com/icons2/3962/PNG/512/globe_global_web_internet_international_earth_eco_icon_252571.png";

export const iconRoutes = (req: Request, res: Response) => {
  http.get(iconPath, (response) => {
    res.set("Content-Type", "image/x-icon");
    response.pipe(res);
  });
};
