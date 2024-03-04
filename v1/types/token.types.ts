import type { PrismaModels } from "./PrismaModels";

export type BlackList = PrismaModels["blacklist"];

export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};
