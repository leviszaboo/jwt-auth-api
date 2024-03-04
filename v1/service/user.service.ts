import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { UserInput, User } from "../models/user.model";
import { prisma } from "../db/connect";
import { signJwt } from "../utils/jwt.utils";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import config from "config";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";

const salt = config.get<number>("bcrypt.salt");

export async function getUserById(
  id: string,
): Promise<Omit<User, "password_hash">> {
  try {
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
  } catch (err: any) {
    throw err;
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
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
  } catch (err: any) {
    throw err;
  }
}

interface AuthResponse {
  user: Omit<User, "password_hash">;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(input: UserInput): Promise<AuthResponse> {
  try {
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
      user: {
        user_id: user.user_id,
        email: user.email,
        email_verified: user.email_verified,
      },
      accessToken: token,
      refreshToken: refreshToken,
    };
  } catch (err: any) {
    throw err;
  }
}

export async function createUser(input: UserInput) {
  try {
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
  } catch (err: any) {
    throw err;
  }
}

export async function deleteUser(id: string) {
  try {
    const user = await prisma.users.delete({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new UserNotFoundError("User not found with the provided user ID.");
    }

    return true;
  } catch (err: any) {
    throw err;
  }
}

export async function updateEmail(id: string, newEmail: string) {
  try {
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
  } catch (err: any) {
    throw err;
  }
}

export async function updatePassword(id: string, newPassword: string) {
  try {
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
  } catch (err: any) {
    throw err;
  }
}
