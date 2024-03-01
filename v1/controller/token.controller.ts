import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  blackListToken,
  checkBlackListedToken,
  reissueAccessToken,
} from "../service/token.service";
import {
  InvalidateTokenInput,
  ReissueTokenInput,
} from "../schema/token.schema";

export async function reissueAccessTokenHandler(
  req: Request<{}, {}, ReissueTokenInput["body"]>,
  res: Response,
) {
  try {
    const { refreshToken } = req.body;

    const blacklisted = await checkBlackListedToken(refreshToken);

    if (blacklisted) {
      return res.status(401).send("Invalid refresh token.");
    }

    const { newAccessToken, newRefreshToken } =
      await reissueAccessToken(refreshToken);

    if (!newAccessToken || !newRefreshToken) {
      return res.status(401).send("Unsuccessful reissue of access token.");
    }

    return res.send({ newAccessToken, newRefreshToken });
  } catch (err: any) {
    logger.error(err);
    return res
      .status(500)
      .send("Unable to reissue access token. Please try again.");
  }
}

export async function invalidateTokenHandler(
  req: Request<{}, {}, InvalidateTokenInput["body"]>,
  res: Response,
) {
  try {
    const { accessToken, refreshToken } = req.body;

    if (accessToken) {
      await blackListToken(accessToken);
    }

    if (refreshToken) {
      await blackListToken(refreshToken);
    }

    res.setHeader("Authorization", "");
    res.clearCookie("refresh");
    res.sendStatus(204);
  } catch (err: any) {
    return res.status(500).send("Unsuccessful logout. Please try again.");
  }
}
