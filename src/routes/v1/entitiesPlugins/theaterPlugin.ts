import { getTheaterDAL } from "../../../DB/DALs/theaterDAL";
import { Application } from "../../../application";
import { setBearerAuthMiddleware } from "../auth/auth";
import { getBaseEntityPlugin } from "./baseEntityPlugin";

const theatersRoutePrefix = `/theaters`;

export const setTheaterPlugin = async (app: Application) => {
  const theaterDal = getTheaterDAL();

  await app.register(
    async (theaterRoutes) => {
      await setBearerAuthMiddleware(theaterRoutes, [`user`, `admin`]);
      await theaterRoutes.register(getBaseEntityPlugin(theaterDal));
    },
    { prefix: theatersRoutePrefix }
  );
};
