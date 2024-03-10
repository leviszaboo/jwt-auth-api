import { afterEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../db/__mocks__/prisma";

import { getUserByEmail } from "../../../service/user.service";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";
import { ModelUser, OmitPasswordHash } from "../../../types/user.types";

vi.mock("../../../db/prisma", () => ({
  prisma,
}));

describe("getUserByEmail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return user data", async () => {
    const email = "email@email.com";

    const user: OmitPasswordHash<ModelUser> = {
      user_id: "1",
      email: "email@email.com",
      email_verified: false,
    };

    prisma.users.findUnique.mockResolvedValue(user as any); // not aware of select
    const result = await getUserByEmail(email);

    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: {
        email: email,
      },
    });

    expect(result).toStrictEqual(user);
  });

  it("should throw UserNotFoundError if user not found", async () => {
    const email = "email@email.com";

    prisma.users.findUnique.mockResolvedValue(null);

    await expect(getUserByEmail(email)).rejects.toThrow();
    await expect(getUserByEmail(email)).rejects.toThrowError(UserNotFoundError);
  });
});
