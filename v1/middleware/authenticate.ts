import { NextFunction, Request, Response } from "express";
import { Config } from "../utils/options";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-gator-api-key"];

  if (!apiKey) {
    return res.status(401).send("Missing API key.");
  }

  if (apiKey !== Config.API_KEY) {
    return res.status(401).send("Provided API Key is invalid.");
  }

  return next();
};

export default authenticate;
