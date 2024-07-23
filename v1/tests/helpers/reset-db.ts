import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function resetDb() {
  try {
    await prisma.users.delete({
      where: {
        email: "test@gator.io",
      },
    });

    await prisma.users.delete({
      where: {
        user_id: "00000000-0000-0000-0000-000000000001",
      },
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // ignore if the record is not found
    } else {
      throw err;
    }
  }

  await prisma.users.create({
    data: {
      email: "test2@gator.io",
      password_hash: "testpassword",
      user_id: "00000000-0000-0000-0000-000000000001",
      email_verified: false,
    },
  });
}
