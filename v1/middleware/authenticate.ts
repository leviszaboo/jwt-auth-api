import config from "config";
import { NextFunction, Request, Response } from "express";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-gator-api-key"];
  const appId = req.headers["x-gator-app-id"];

  if (!apiKey) {
    return res.status(401).send("Missing API key.");
  }

  if (!appId) {
    return res.status(401).send("Missing App ID.");
  }

  if (apiKey !== config.get("apiKey") || appId !== config.get("appId")) {
    return res.status(401).send("Provided API Key or App ID is invalid.");
  }

  return next();
}
