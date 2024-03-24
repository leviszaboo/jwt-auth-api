import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import * as PrismaUtils from "../../../utils/prisma.utils";
import * as createUserObject from "../../helpers/createUserObject";

import { getUserById } from "../../../service/user.service";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";
import { ModelUser, User } from "../../../types/user.types";

describe("getUserById", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return user data", async () => {
    const id = "1";

    const modelUser: ModelUser = {
      user_id: "1",
      email: "email@email.com",
      email_verified: false,
      password_hash: "password_hash",
    };

    const user: User = {
      userId: "1",
      email: "email@email.com",
      emailVerified: false,
    };

    const getUserByUniqueKeySpy = vi.spyOn(PrismaUtils, "getUserByUniqueKey");
    const createUserObjectSpy = vi.spyOn(createUserObject, "createUserObject");

    getUserByUniqueKeySpy.mockResolvedValue(modelUser);
    createUserObjectSpy.mockReturnValue(user);

    const result = await getUserById(id);

    expect(getUserByUniqueKeySpy).toHaveBeenCalledWith({ user_id: id });
    expect(createUserObjectSpy).toHaveBeenCalledWith(modelUser);

    expectTypeOf(result).toEqualTypeOf<User>();

    expect(result).toStrictEqual(user);
  });

  it("should throw UserNotFoundError if user not found", async () => {
    const id = "1";

    const getUserByUniqueKeySpy = vi.spyOn(PrismaUtils, "getUserByUniqueKey");

    getUserByUniqueKeySpy.mockResolvedValue(null);

    await expect(getUserById(id)).rejects.toThrow();
    await expect(getUserById(id)).rejects.toThrowError(UserNotFoundError);
  });
});
