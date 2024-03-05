import { afterEach, describe, expect, it, vi } from "vitest";
import prisma from "../../../db/__mocks__/prisma";

import { checkBlackListedToken } from "../../../service/token.service";

vi.mock("../../../db/prisma", () => ({
  prisma,
}));

describe("checkBlackListedToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true if token is blacklisted", async () => {
    const token = "token";

    prisma.blacklist.findUnique.mockResolvedValue({ token });

    const result = await checkBlackListedToken(token);

    expect(prisma.blacklist.findUnique).toHaveBeenCalledWith({
      where: {
        token: token,
      },
    });

    expect(result).toBe(true);
  });

  it("should return false if token is not blacklisted", async () => {
    const token = "token";

    prisma.blacklist.findUnique.mockResolvedValue(null);

    const result = await checkBlackListedToken(token);

    expect(prisma.blacklist.findUnique).toHaveBeenCalledWith({
      where: {
        token: token,
      },
    });

    expect(result).toBe(false);
  });
});
