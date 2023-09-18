import { getMovieDAL } from "../../../DB/DALs/movieDAL";
import { Application } from "../../../application";
import { setBearerAuthMiddleware } from "../auth/auth";
import { getBaseEntityPlugin } from "./baseEntityPlugin";

const moviesRoutePrefix = `/movies`;

export const setMoviePlugin = async (app: Application) => {
  const movieDal = getMovieDAL();

  await app.register(
    async (moviesRoutes) => {
      await setBearerAuthMiddleware(moviesRoutes, [`user`, `admin`]);
      await moviesRoutes.register(getBaseEntityPlugin(movieDal));
    },
    { prefix: moviesRoutePrefix }
  );
};
