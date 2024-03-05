import { afterEach, describe, expect, it, vi } from "vitest";
import { reissueAccessToken } from "../../token.service";
import * as TokenUtils from "../../../utils/jwt.utils";
import * as UserService from "../../user.service";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";

describe("reissueAccessToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return new access and refresh token", async () => {
    const refreshToken = "refreshToken";

    const user = {
      user_id: "1",
      email: "email",
      email_verified: false,
    };

    const validResponse = {
      valid: true,
      expired: false,
      decoded: {
        userId: user.user_id,
        email: user.email,
      },
    };

    const newRefreshToken = "newRefreshToken";
    const newAccessToken = "newAccessToken";

    const verifyJwtSpy = vi.spyOn(TokenUtils, "verifyJwt");
    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");
    const signJwtSpy = vi.spyOn(TokenUtils, "signJwt");

    verifyJwtSpy.mockResolvedValue(validResponse);
    getUserByIdSpy.mockResolvedValue(user);
    signJwtSpy.mockReturnValueOnce(newRefreshToken);
    signJwtSpy.mockReturnValueOnce(newAccessToken);

    const result = await reissueAccessToken(refreshToken);

    expect(verifyJwtSpy).toHaveBeenCalledWith(refreshToken, "refresh");
    expect(getUserByIdSpy).toHaveBeenCalledWith(validResponse.decoded.userId);

    expect(signJwtSpy).toHaveBeenCalledWith(
      {
        userId: user.user_id,
      },
      "refresh",
      {
        expiresIn: "1d",
      },
    );

    expect(signJwtSpy).toHaveBeenCalledWith(
      {
        userId: user.user_id,
        email: user.email,
      },
      "access",
      {
        expiresIn: "5m",
      },
    );

    expect(result).toStrictEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
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
