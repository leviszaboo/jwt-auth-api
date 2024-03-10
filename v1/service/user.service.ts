import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserInput, User, AuthResponse, ModelUser } from "../types/user.types";
import { prisma } from "../db/prisma";
import { signJwt } from "../utils/jwt.utils";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import logger from "../utils/logger";
import { snakeToCamelCase } from "./helpers/snakeToCamelCase";
import { Config, PrismaErrorCodes, TokenOptions } from "../utils/options";
import InternalServerError from "../errors/global/InternalServerError";

export const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.users.findUnique({
    where: {
      user_id: id,
    },
  });

  if (!user) {
    throw new UserNotFoundError(`User not found with ID: ${id}`);
  }

  return snakeToCamelCase(user);
};

export const getUserByEmail = async (email: string): Promise<ModelUser> => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new UserNotFoundError(
      `User not found with the provided email address: ${email}`,
    );
  }

  return user;
};

export const loginUser = async (input: UserInput): Promise<AuthResponse> => {
  const user = await getUserByEmail(input.email);

  const passwordMatch = await bcrypt.compare(
    input.password,
    user.password_hash,
  );

  if (!passwordMatch) {
    throw new IncorrectPasswordError(
      "The provided password does not match the user's password.",
    );
  }

  const accessToken = signJwt(
    {
      userId: user.user_id,
      email: user.email,
    },
    TokenOptions.ACCESS,
    {
      expiresIn: Config.ACCESS_TOKEN_EXPIRES_IN,
    },
  );

  const refreshToken = signJwt(
    {
      userId: user.user_id,
    },
    TokenOptions.REFRESH,
    {
      expiresIn: Config.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  return {
    userId: user.user_id,
    email: user.email,
    emailVerified: user.email_verified,
    accessToken,
    refreshToken,
  };
};

export const createUser = async (input: UserInput): Promise<User> => {
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(input.password, Config.BCRYPT_SALT);

  try {
    const user = await prisma.users.create({
      data: {
        user_id: userId,
        email: input.email,
        password_hash: passwordHash,
      },
    });

    return snakeToCamelCase(user);
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
    await prisma.users.delete({
      where: {
        user_id: id,
      },
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
    await prisma.users.update({
      where: {
        user_id: id,
      },
      data: {
        email: newEmail,
      },
    });

    return true;
  } catch (err: any) {
    if ((err.code = PrismaErrorCodes.RECORD_NOT_FOUND)) {
      throw new UserNotFoundError(`User not found with ID: ${id}`);
    }

    logger.error(err);

    throw new InternalServerError(
      "An error occurred while updating the user's email.",
    );
  }
};

export const updatePassword = async (
  id: string,
  newPassword: string,
): Promise<boolean> => {
  const passwordHash = await bcrypt.hash(newPassword, Config.BCRYPT_SALT);

  try {
    await prisma.users.update({
      where: {
        user_id: id,
      },
      data: {
        password_hash: passwordHash,
      },
    });

    return true;
  } catch (err: any) {
    if ((err.code = PrismaErrorCodes.RECORD_NOT_FOUND)) {
      throw new UserNotFoundError(`User not found with ID: ${id}`);
    }

    logger.error(err);

    throw new InternalServerError(
      "An error occurred while updating the user's password.",
    );
  }
};
