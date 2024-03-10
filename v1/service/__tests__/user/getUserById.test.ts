import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import prisma from "../../../db/__mocks__/prisma";

import { getUserById } from "../../../service/user.service";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";
import { User } from "../../../types/user.types";

vi.mock("../../../db/prisma", () => ({
  prisma,
}));

describe("getUserById", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return user data", async () => {
    const id = "1";

    const user: User = {
      userId: "1",
      email: "email@email.com",
      emailVerified: false,
    };

    prisma.users.findUnique.mockResolvedValue(user as any); // not aware of select
    const result = await getUserById(id);

    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        email: true,
        email_verified: true,
      },
    });

    expectTypeOf(result).toEqualTypeOf<User>();

    expect(result).toStrictEqual(user);
  });

  it("should throw UserNotFoundError if user not found", async () => {
    const id = "1";

    prisma.users.findUnique.mockResolvedValue(null);

    await expect(getUserById(id)).rejects.toThrow();
    await expect(getUserById(id)).rejects.toThrowError(UserNotFoundError);
  });
});
