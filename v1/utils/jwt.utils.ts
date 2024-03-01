import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import config from "config";
import { checkBlackListedToken } from "../service/token.service";

const accessTokenPrivateKey = config.get<string>(
  "jwt.jwtAccessTokenPrivateKey",
);
const accessTokenPublicKey = config.get<string>("jwt.jwtAccessTokenPublicKey");
const refreshTokenPrivateKey = config.get<string>(
  "jwt.jwtRefreshTokenPrivateKey",
);
const refreshTokenPublicKey = config.get<string>(
  "jwt.jwtRefreshTokenPrivateKey",
);

interface UserPayload extends JwtPayload {
  userId: string;
  email: string;
}

export function signJwt(
  object: Object,
  tokenType: "refresh" | "access",
  options?: jwt.SignOptions | undefined,
) {
  const key =
    tokenType === "access" ? accessTokenPrivateKey : refreshTokenPrivateKey;
  return jwt.sign(object, key, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export async function verifyJwt(
  token: string,
  tokenType: "refresh" | "access",
) {
  const blackListed = await checkBlackListedToken(token);

  if (blackListed) {
    return {
      valid: false,
      expired: false,
      decoded: null,
    };
  }

  try {
    const key =
      tokenType === "access" ? accessTokenPublicKey : refreshTokenPublicKey;
    const decoded = jwt.verify(token, key) as UserPayload;
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    console.log("jwt verification error: ", err);
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}

export function setTokenCookie(
  res: Response,
  token: string,
  tokenType: "refresh" | "access",
) {
  if (tokenType === "access") {
    res.cookie("jwtAccessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    return;
  } else {
    res.cookie("jwtRefreshToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
    });
  }
}
