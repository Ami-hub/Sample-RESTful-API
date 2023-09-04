import { StatusCodes } from "http-status-codes";
import { compare } from "bcrypt";

import { createErrorWithStatus } from "../../errorHandling/statusError";
import { EntitiesMapDB } from "../../models/entitiesMaps";
import { IdType, idKey } from "../../models/id";
import { BaseEntityDAL, getBaseEntityDAL } from "./baseEntityDAL";
import { logger } from "../../logging/logger";
import { UserCollectionName, usersCollectionName } from "../../models/user";

type TokenCreationDetails = {
  ip: string;
  userAgent: string | undefined;
};

export interface UserDAL extends BaseEntityDAL<UserCollectionName> {
  /**
   * Get a user by its email
   * @param email the email of the user to get
   * @returns the user found
   */
  getByEmail: (email: string) => Promise<EntitiesMapDB[UserCollectionName]>;

  /**
   * Update the last token info of a user
   * @param userId the id of the user to update
   * @param tokenCreationDetails the details of the token creation
   * @returns the updated user
   */
  updateLastTokenInfo: (
    userId: IdType,
    tokenCreationDetails: TokenCreationDetails
  ) => Promise<void>;

  /**
   * Find the credentials of a user by its email and password
   * @param email the email of the user to find
   * @param password the password of the user to find
   * @returns the user found
   */
  findCredentials: (
    email: string,
    password: string
  ) => Promise<EntitiesMapDB[UserCollectionName]>;
}

export const getUserDAL = (): UserDAL => {
  const baseDAL = getBaseEntityDAL(usersCollectionName);

  const getByEmail = async (email: string) => {
    const usersFound = await baseDAL.get({
      filters: [
        {
          email,
        },
      ],
    });

    if (!usersFound.length) {
      throw createErrorWithStatus(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        `User '${email}' not found`
      );
    }

    return usersFound[0];
  };

  const updateLastTokenInfo = async (
    userId: IdType,
    tokenCreationDetails: TokenCreationDetails
  ) => {
    const user = await baseDAL.update(userId, {
      lastTokenInfo: {
        ip: tokenCreationDetails.ip,
        userAgent: tokenCreationDetails.userAgent,
        date: new Date().toISOString(),
      },
    });

    if (!user) {
      throw createErrorWithStatus(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        `User '${userId}' not found`
      );
    }
  };

  const findCredentials = async (email: string, password: string) => {
    const usersFound = await baseDAL.get({
      filters: [
        {
          email,
        },
      ],
    });

    if (!usersFound.length) {
      throw createErrorWithStatus(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        `User '${email}' not found`
      );
    }
    const user = usersFound[0];

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw createErrorWithStatus(
        "Invalid credentials",
        StatusCodes.UNAUTHORIZED,
        `Invalid password for user '${email}'`
      );
    }

    logger.info(
      `The ${user.role} '${user[idKey]}' logged in with email '${email}'`
    );

    return user;
  };

  return {
    ...baseDAL,
    updateLastTokenInfo,
    findCredentials,
    getByEmail,
  };
};
