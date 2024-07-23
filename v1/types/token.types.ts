import { Models } from "../utils/options";
import type { PrismaModels } from "./prisma.types";

export type ModelBlackList = PrismaModels[Models.TOKENS];

export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};
