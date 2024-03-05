import { prisma } from "../db/prisma";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { TokenPair } from "../types/token.types";
import { getUserById } from "./user.service";

export async function checkBlackListedToken(token: string): Promise<boolean> {
  const blacklisted = await prisma.blacklist.findUnique({
    where: {
      token: token,
    },
  });

  return !!blacklisted;
}

export async function blackListToken(token: string): Promise<void> {
  await prisma.blacklist.create({
    data: {
      token: token,
    },
  });
}

export async function reissueAccessToken(
  refreshToken: string,
): Promise<TokenPair> {
  const { decoded } = await verifyJwt(refreshToken, "refresh");

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

  const newRefreshToken = signJwt(
    {
      userId: user.user_id,
    },
    "refresh",
    {
      expiresIn: "1d",
    },
  );

  const newAccessToken = signJwt(
    {
      userId: user.user_id,
      email: user.email,
    },
    "access",
    {
      expiresIn: "5m",
    },
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}
