import { prisma } from "../db/prisma";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { TokenPair } from "../types/token.types";
import { getUserById } from "./user.service";
import { Config, TokenOptions } from "../utils/options";

export const checkBlackListedToken = async (
  token: string,
): Promise<boolean> => {
  const blacklisted = await prisma.blacklist.findUnique({
    where: {
      token: token,
    },
  });

  return !!blacklisted;
};

export const blackListToken = async (token: string): Promise<void> => {
  await prisma.blacklist.create({
    data: {
      token: token,
    },
  });
};

export const reissueAccessToken = async (
  refreshToken: string,
): Promise<TokenPair> => {
  const { decoded } = await verifyJwt(refreshToken, TokenOptions.REFRESH);

  if (!decoded)
    return {
      accessToken: null,
      refreshToken: null,
    };

  const user = await getUserById(decoded.userId).catch(() => null);

  if (!user)
    return {
      accessToken: null,
      refreshToken: null,
    };

  const { email, userId } = user;

  const newRefreshToken = signJwt(
    {
      userId,
    },
    TokenOptions.REFRESH,
    {
      expiresIn: Config.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  const newAccessToken = signJwt(
    {
      userId,
      email,
    },
    TokenOptions.ACCESS,
    {
      expiresIn: Config.ACCESS_TOKEN_EXPIRES_IN,
    },
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
