import { z } from "zod";
import { accountSchema } from "../validators/validators";

export type Account = z.infer<typeof accountSchema>;

export type EntitesMap = {
  accounts: Account;
};
