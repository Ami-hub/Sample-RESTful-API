import { MovieCollectionName, movieCollectionName } from "../../models/movie";
import { BaseEntityDAL, getBaseEntityDAL } from "./baseEntityDAL";

export interface MovieDAL extends BaseEntityDAL<MovieCollectionName> {}

export const getMovieDAL = (): MovieDAL => {
  const baseDAL = getBaseEntityDAL(movieCollectionName);

  return {
    ...baseDAL,
  };
};
