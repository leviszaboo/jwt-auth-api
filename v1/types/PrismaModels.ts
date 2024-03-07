import type { PrismaClient, Prisma } from "@prisma/client";

export type ModelNames = Prisma.ModelName;

export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};
