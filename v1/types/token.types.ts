import type { PrismaModels } from "./prisma.types";

export type ModelBlackList = PrismaModels["blacklist"];

export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};
