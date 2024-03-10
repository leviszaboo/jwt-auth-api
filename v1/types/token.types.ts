import type { PrismaModels } from "./types";

export type BlackList = PrismaModels["blacklist"];

export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};
