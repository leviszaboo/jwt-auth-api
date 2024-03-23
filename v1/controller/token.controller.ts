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
import { asyncHandler } from "../utils/express.utils";

export const reissueAccessTokenHandler = asyncHandler(
  async (req: Request<{}, {}, ReissueTokenInput["body"]>, res: Response) => {
    const { refreshToken } = req.body;

    const blacklisted = await checkBlackListedToken(refreshToken);

    if (blacklisted) {
      return res.status(401).send("Invalid refresh token.");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await reissueAccessToken(refreshToken);

    if (!newAccessToken || !newRefreshToken) {
      return res.status(401).send("Unsuccessful reissue of access token.");
    }

    return res.send({ newAccessToken, newRefreshToken });
  },
);

export const invalidateTokenHandler = asyncHandler(
  async (req: Request<{}, {}, InvalidateTokenInput["body"]>, res: Response) => {
    const { accessToken, refreshToken } = req.body;

    for (const token of [accessToken, refreshToken]) {
      const blacklisted = await checkBlackListedToken(token);

      if (token && !blacklisted) {
        await blackListToken(token);
      }
    }

    res.setHeader("Authorization", "");
    res.clearCookie("refresh");
    res.sendStatus(204);
  },
);
