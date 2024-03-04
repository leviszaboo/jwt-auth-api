import type { PrismaModels } from "./PrismaModels";

export type UserInput = {
  email: string;
  password: string;
};

export type User = PrismaModels["users"];
