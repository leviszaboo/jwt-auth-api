import { TokenPair } from "../../types/token.types";
import { User } from "../../types/user.types";
import { signJwt } from "../../utils/jwt.utils";
import { Config, TokenOptions } from "../../utils/options";

export const createTokenPair = (user: User): TokenPair => {
  const accessToken = signJwt(user, TokenOptions.ACCESS, {
    expiresIn: Config.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = signJwt(user, TokenOptions.REFRESH, {
    expiresIn: Config.REFRESH_TOKEN_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
  };
};
