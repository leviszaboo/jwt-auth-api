import { NextFunction, Request, Response } from "express";
import { UserSchema } from "../schema/user.schema";

/**
 * Middleware to check if an authenticated user is making the request.
 */
export default function requireUser(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user;

  if (!user) {
    return res
      .status(401)
      .send("You need to be logged in to access this resource.");
  }

  try {
    UserSchema.parse(res.locals.user);
  } catch (err) {
    return res.status(401).send("Invalid user data.");
  }

  return next();
}
