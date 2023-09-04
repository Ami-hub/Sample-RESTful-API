import {
  TheaterCollectionName,
  theaterCollectionName,
} from "../../models/theater";
import { BaseEntityDAL, getBaseEntityDAL } from "./baseEntityDAL";

export interface TheaterDAL extends BaseEntityDAL<TheaterCollectionName> {}

export const getTheaterDAL = (): TheaterDAL => {
  const baseDAL = getBaseEntityDAL(theaterCollectionName);

  return {
    ...baseDAL,
  };
};
