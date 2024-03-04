import { prisma } from "../db/connect";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { BlackList } from "../models/blacklist.model";
import { getUserById } from "./user.service";

export async function checkBlackListedToken(token: string) {
  try {
    const blackListedToken = await prisma.blacklist.findUnique({
      where: {
        token: token,
      },
    });

    return blackListedToken ? true : false;
  } catch (err: any) {
    throw err;
  }
}

export async function blackListToken(token: string) {
  if (await checkBlackListedToken(token)) {
    return;
  }

  try {
    await prisma.blacklist.create({
      data: {
        token: token,
      },
    });
  } catch (err: any) {
    throw err;
  }
}

export async function reissueAccessToken(refreshToken: string) {
  const { decoded } = await verifyJwt(refreshToken, "refresh");

  if (!decoded)
    return {
      newAccessToken: null,
      newRefreshToken: null,
    };

  const user = await getUserById(decoded.userId);

  if (!user)
    return {
      newAccessToken: null,
      newRefreshToken: null,
    };

  const newRefreshToken = signJwt({ userId: user.user_id }, "refresh", {
    expiresIn: "1d",
  });

  const newAccessToken = signJwt(
    { userId: user.user_id, email: user.email },
    "access",
    {
      expiresIn: "5m",
    },
  );

  return {
    newAccessToken: newAccessToken,
    newRefreshToken: newRefreshToken,
  };
}
