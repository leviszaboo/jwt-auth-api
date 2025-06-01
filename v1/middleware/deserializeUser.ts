import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { reissueAccessToken } from "../service/token.service";
import { setTokenCookie } from "../utils/jwt.utils";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    "",
  );

  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = await verifyJwt(accessToken, "access");

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await reissueAccessToken(refreshToken);

    if (!newAccessToken || !newRefreshToken) {
      return next();
    }

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);

    setTokenCookie(res, newRefreshToken, "refresh");

    const result = await verifyJwt(newAccessToken, "access");
    res.locals.user = result.decoded;
  }

  return next();
}
