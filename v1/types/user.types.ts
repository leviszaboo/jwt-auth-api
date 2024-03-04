import type { PrismaModels } from "./PrismaModels";
import { TokenPair } from "./token.types";

export type OmitPasswordHash<T> = Omit<T, "password_hash">;

export type UserInput = {
  email: string;
  password: string;
};

export type User = PrismaModels["users"];

export type AuthResponse = OmitPasswordHash<User> & TokenPair;
