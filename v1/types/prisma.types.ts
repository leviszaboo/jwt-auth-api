import type { PrismaClient, Prisma } from "@prisma/client";
import { Models } from "../utils/options";
import { ModelBlackList } from "./token.types";
import { ModelUser } from "./user.types";

export type ModelNames = Prisma.ModelName;

export type UniqueModelInput<M extends ModelNames> = M extends Models.USERS
  ? Prisma.usersWhereUniqueInput
  : Prisma.blacklistWhereUniqueInput;

export type CreateModelInput<M extends ModelNames> = M extends Models.USERS
  ? Prisma.usersCreateInput
  : Prisma.blacklistCreateInput;

export type UpdateModelInput<M extends ModelNames> = M extends Models.USERS
  ? Prisma.usersUpdateInput
  : Prisma.blacklistUpdateInput;

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};
