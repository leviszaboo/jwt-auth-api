import { prisma } from "../db/prisma";
import { Models } from "./options";
import {
  CreateModelInput,
  UniqueModelInput,
  UpdateModelInput,
} from "../types/prisma.types";
import { ModelUser } from "../types/user.types";
import { ModelBlackList } from "../types/token.types";

export const getUserByUniqueKey = async ({
  ...input
}: UniqueModelInput<Models.USERS>): Promise<ModelUser | null> => {
  const user = await prisma.users.findUnique({
    where: {
      ...input,
    },
  });

  return user;
};

export const prismaCreateUser = async ({
  ...input
}: CreateModelInput<Models.USERS>): Promise<ModelUser> => {
  const user = await prisma.users.create({
    data: {
      ...input,
    },
  });

  return user;
};

export const updateUserField = async (
  id: string,
  updateData: UpdateModelInput<Models.USERS>,
): Promise<ModelUser> => {
  return await prisma.users.update({
    where: {
      user_id: id,
    },
    data: {
      ...updateData,
    },
  });
};

export const deleteUserByUniqueKey = async ({
  ...input
}: UniqueModelInput<Models.USERS>): Promise<ModelUser> => {
  return await prisma.users.delete({
    where: {
      ...input,
    },
  });
};

export const getBlacklistedTokenByUniqueKey = async ({
  ...input
}: UniqueModelInput<Models.TOKENS>): Promise<ModelBlackList | null> => {
  return await prisma.blacklist.findUnique({
    where: {
      ...input,
    },
  });
};

export const createBlacklistedToken = async ({
  ...input
}: CreateModelInput<Models.TOKENS>): Promise<ModelBlackList> => {
  return await prisma.blacklist.create({
    data: {
      ...input,
    },
  });
};
