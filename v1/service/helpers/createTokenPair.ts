import { TokenPair } from "../../types/token.types";
import { User } from "../../types/user.types";
import { signJwt } from "../../utils/jwt.utils";
import { Config, TokenOptions } from "../../utils/options";

export const createTokenPair = (user: User): TokenPair => {
  const accessToken = signJwt(
    {
      userId: user.userId,
      email: user.email,
    },
    TokenOptions.ACCESS,
    {
      expiresIn: Config.ACCESS_TOKEN_EXPIRES_IN,
    },
  );

  const refreshToken = signJwt(
    {
      userId: user.userId,
    },
    TokenOptions.REFRESH,
    {
      expiresIn: Config.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};
