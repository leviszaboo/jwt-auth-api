import { verifyJwt } from "../utils/jwt.utils";
import { TokenPair } from "../types/token.types";
import { getUserById } from "./user.service";
import { TokenOptions } from "../utils/options";
import { createTokenPair } from "./helpers/createTokenPair";
import {
  createBlacklistedToken,
  getBlacklistedTokenByUniqueKey,
} from "../utils/prisma.utils";

export const checkBlackListedToken = async (
  token: string,
): Promise<boolean> => {
  const blacklisted = await getBlacklistedTokenByUniqueKey({
    token: token,
  });

  return !!blacklisted;
};

export const blackListToken = async (token: string): Promise<void> => {
  await createBlacklistedToken({
    token: token,
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

  const tokenPair = createTokenPair(user);

  return {
    ...tokenPair,
  };
};
