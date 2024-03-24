import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { reissueAccessToken } from "../../token.service";
import * as TokenUtils from "../../../utils/jwt.utils";
import * as UserService from "../../user.service";
import * as createTokenPair from "../../helpers/createTokenPair";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";
import { User } from "../../../types/user.types";
import { TokenPair } from "../../../types/token.types";

describe("reissueAccessToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return new access and refresh token", async () => {
    const refreshToken = "refreshToken";

    const user: User = {
      userId: "1",
      email: "email",
      emailVerified: false,
    };

    const validResponse = {
      valid: true,
      expired: false,
      decoded: {
        userId: user.userId,
        email: user.email,
      },
    };

    const tokenPair: TokenPair = {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };

    const verifyJwtSpy = vi.spyOn(TokenUtils, "verifyJwt");
    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");
    const signJwtSpy = vi.spyOn(TokenUtils, "signJwt");
    const createTokenPairSpy = vi.spyOn(createTokenPair, "createTokenPair");

    verifyJwtSpy.mockResolvedValue(validResponse);
    getUserByIdSpy.mockResolvedValue(user);
    createTokenPairSpy.mockReturnValue(tokenPair);

    const result = await reissueAccessToken(refreshToken);

    expect(verifyJwtSpy).toHaveBeenCalledWith(refreshToken, "refresh");
    expect(getUserByIdSpy).toHaveBeenCalledWith(validResponse.decoded.userId);
    expect(createTokenPairSpy).toHaveBeenCalledWith(user);

    expectTypeOf(result).toEqualTypeOf<TokenPair>();
    expect(result).toStrictEqual(tokenPair);
  });

  it("should return null access and refresh token if refresh token is invalid", async () => {
    const refreshToken = "refreshToken";

    const invalidResponse = {
      valid: false,
      expired: false,
      decoded: null,
    };

    const verifyJwtSpy = vi.spyOn(TokenUtils, "verifyJwt");

    verifyJwtSpy.mockResolvedValue(invalidResponse);

    const result = await reissueAccessToken(refreshToken);

    expect(verifyJwtSpy).toHaveBeenCalledWith(refreshToken, "refresh");

    expect(result).toStrictEqual({
      accessToken: null,
      refreshToken: null,
    });
  });

  it("should return null access and refresh token if user is not found", async () => {
    const refreshToken = "refreshToken";

    const validResponse = {
      valid: true,
      expired: false,
      decoded: {
        userId: "1",
        email: "email",
      },
    };

    const verifyJwtSpy = vi.spyOn(TokenUtils, "verifyJwt");
    verifyJwtSpy.mockResolvedValue(validResponse);

    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");
    getUserByIdSpy.mockRejectedValue(new UserNotFoundError("User not found"));

    const result = await reissueAccessToken(refreshToken);

    expect(getUserByIdSpy).toHaveBeenCalledWith(validResponse.decoded.userId);

    expect(result).toStrictEqual({
      accessToken: null,
      refreshToken: null,
    });
  });
});
