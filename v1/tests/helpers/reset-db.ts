import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function resetDb() {
  await prisma.$transaction([
    prisma.users.deleteMany({
      where: {
        email: "test@gator.io",
      },
    }),
    prisma.blacklist.deleteMany({
      where: {
        token: "test-token",
      },
    }),
  ]);
}
