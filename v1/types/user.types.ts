import type { PrismaModels } from "./prisma.types";
import { KeysToCamelCase } from "./types";
import { TokenPair } from "./token.types";
import { Models } from "../utils/options";

export type OmitPasswordHash<T> = Omit<T, "password_hash">;

export type UserInput = {
  email: string;
  password: string;
};

export type UpdateEmailInput = {
  id: string;
  newEmail: string;
};

export type UpdatePasswordInput = {
  id: string;
  newPassword: string;
};

export type ModelUser = PrismaModels[Models.USERS];

export type User = KeysToCamelCase<OmitPasswordHash<ModelUser>>;

export type AuthResponse = User & TokenPair;
