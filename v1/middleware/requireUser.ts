import { NextFunction, Request, Response } from "express";

export default function requireUser(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  return next();
}
