import { Request, Response, NextFunction } from "express";
import { User } from "../types/user.types";

/**
 * Middleware to check if the authenticated user owns the requested resource.
 */
export async function checkOwnership(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = res.locals.user as User; // require user is called before whwich checks for the correct type

  if (!user) {
    return res
      .status(401)
      .send("You need to be logged in to access this resource.");
  }

  const resourceId = req.params["userId"];

  if (!resourceId) {
    return res.status(400).send("Resource ID not provided.");
  }

  if (resourceId !== user.userId) {
    console.warn(
      `Unauthorized access attempt by user ${user.userId} to resource ${resourceId}`,
    );
    return res
      .status(403)
      .send("You are not authorized to access this resource.");
  }

  res.locals.user = user;
  return next();
}
