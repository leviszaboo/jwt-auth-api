import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {
  UserInput,
  User,
  OmitPasswordHash,
  AuthResponse,
} from "../types/user.types";
import { prisma } from "../db/connect";
import { signJwt } from "../utils/jwt.utils";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import config from "config";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";

const salt = config.get<number>("bcrypt.salt");

export async function getUserById(id: string): Promise<OmitPasswordHash<User>> {
  const user = await prisma.users.findUnique({
    where: {
      user_id: id,
    },
    select: {
      user_id: true,
      email: true,
      email_verified: true,
    },
  });

  if (!user) {
    throw new UserNotFoundError("User not found with the provided user ID.");
  }

  return user;
}

export async function getUserByEmail(email: string): Promise<User> {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new UserNotFoundError(
      "User not found with the provided email address.",
    );
  }

  return user;
}

export async function loginUser(input: UserInput): Promise<AuthResponse> {
  const user = await getUserByEmail(input.email);

  if (!user) {
    throw new UserNotFoundError(
      "User not found with the provided email address.",
    );
  }

  const passwordMatch = await bcrypt.compare(
    input.password,
    user.password_hash,
  );

  if (!passwordMatch) {
    throw new IncorrectPasswordError(
      "Incorrect password for the provided email address.",
    );
  }

  const token = signJwt(
    {
      userId: user.user_id,
      email: user.email,
    },
    "access",
    {
      expiresIn: config.get<string>("jwt.accessTokenExpiresIn"),
    },
  );

  const refreshToken = signJwt({ userId: user.user_id }, "refresh", {
    expiresIn: config.get<string>("jwt.refreshTokenExpiresIn"),
  });

  return {
    user_id: user.user_id,
    email: user.email,
    email_verified: user.email_verified,
    accessToken: token,
    refreshToken: refreshToken,
  };
}

export async function createUser(input: UserInput) {
  const existingUser = await getUserByEmail(input.email);

  if (existingUser) {
    throw new EmailExistsError(
      "A user account with the provided email address already exists.",
    );
  }

  const userId = uuidv4();
  const passwordHash = await bcrypt.hash(input.password, salt);

  const user = await prisma.users.create({
    data: {
      user_id: userId,
      email: input.email,
      password_hash: passwordHash,
    },
  });

  return user;
}

export async function deleteUser(id: string) {
  const user = await prisma.users.delete({
    where: {
      user_id: id,
    },
  });

  if (!user) {
    throw new UserNotFoundError("User not found with the provided user ID.");
  }

  return true;
}

export async function updateEmail(id: string, newEmail: string) {
  const user = await prisma.users.update({
    where: {
      user_id: id,
    },
    data: {
      email: newEmail,
    },
  });

  if (!user) {
    throw new UserNotFoundError("User not found with the provided user ID.");
  }

  return true;
}

export async function updatePassword(id: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, salt);

  const user = await prisma.users.update({
    where: {
      user_id: id,
    },
    data: {
      password_hash: passwordHash,
    },
  });

  if (!user) {
    throw new UserNotFoundError("User not found with the provided user ID.");
  }

  return true;
}
