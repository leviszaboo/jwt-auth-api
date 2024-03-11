import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserInput, User, AuthResponse } from "../types/user.types";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import logger from "../utils/logger";
import { Config, PrismaErrorCodes } from "../utils/options";
import InternalServerError from "../errors/global/InternalServerError";
import { createTokenPair } from "./helpers/createTokenPair";
import { checkPasswordMatch } from "./helpers/checkPasswordMatch";
import { createUserObject } from "./helpers/createUserObject";
import {
  deleteUserByUniqueKey,
  getUserByUniqueKey,
  prismaCreateUser,
  updateUserField,
} from "../utils/prisma.utils";

export const getUserById = async (id: string): Promise<User> => {
  const user = await getUserByUniqueKey({
    user_id: id,
  });

  if (!user) {
    throw new UserNotFoundError(`User not found with ID: ${id}`);
  }

  return createUserObject(user);
};

export const loginUser = async (input: UserInput): Promise<AuthResponse> => {
  const existingUser = await getUserByUniqueKey({
    email: input.email,
  });

  if (!existingUser) {
    throw new UserNotFoundError(`User not found with email: ${input.email}`);
  }

  const passwordMatch = await checkPasswordMatch(input, existingUser);

  if (!passwordMatch) {
    throw new IncorrectPasswordError(
      "The provided password does not match the user's password.",
    );
  }

  const user = createUserObject(existingUser);
  const tokenPair = createTokenPair(user);

  return {
    ...user,
    ...tokenPair,
  };
};

export const createUser = async (input: UserInput): Promise<User> => {
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(input.password, Config.BCRYPT_SALT);

  try {
    const user = await prismaCreateUser({
      user_id: userId,
      password_hash: passwordHash,
      ...input,
    });

    return createUserObject(user);
  } catch (err: any) {
    if (err.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
      throw new EmailExistsError(
        `A user with the email address ${input.email} already exists.`,
      );
    }

    logger.error(err);

    throw new InternalServerError("An error occurred while creating the user.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    await deleteUserByUniqueKey({
      user_id: id,
    });

    return true;
  } catch (err: any) {
    if ((err.code = PrismaErrorCodes.RECORD_NOT_FOUND)) {
      throw new UserNotFoundError(`User not found with ID: ${id}`);
    }

    logger.error(err);

    throw new InternalServerError("An error occurred while deleting the user.");
  }
};

export const updateEmail = async (
  id: string,
  newEmail: string,
): Promise<boolean> => {
  try {
    await updateUserField(id, {
      email: newEmail,
    });

    return true;
  } catch (err: any) {
    if (err.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
      throw new UserNotFoundError(`User not found with ID: ${id}`);
    }

    logger.error(err);

    throw new InternalServerError("An error occurred while updating the user.");
  }
};

export const updatePassword = async (
  id: string,
  newPassword: string,
): Promise<boolean> => {
  const passwordHash = await bcrypt.hash(newPassword, Config.BCRYPT_SALT);

  try {
    await updateUserField(id, {
      password_hash: passwordHash,
    });

    return true;
  } catch (err: any) {
    if (err.code === PrismaErrorCodes.RECORD_NOT_FOUND) {
      throw new UserNotFoundError(`User not found with ID: ${id}`);
    }

    logger.error(err);

    throw new InternalServerError("An error occurred while updating the user.");
  }
};
