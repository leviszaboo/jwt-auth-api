import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  loginUser,
  updateEmail,
  updatePassword,
} from "../service/user.service";
import {
  CreateUserInput,
  GetUserByIdInput,
  LoginUserInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from "../schema/user.schema";
import UserNotFoundError from "../errors/user/UserNotFoundError";
import IncorrectPasswordError from "../errors/user/IncorrectPasswordError";
import EmailExistsError from "../errors/user/EmailExistsError";
import { setTokenCookie } from "../utils/jwt.utils";

export async function getUserByIdHandler(
  req: Request<GetUserByIdInput["params"]>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);

    return res.send(user);
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    return res.status(500).send("Could not retrieve user. Please try again.");
  }
}

export async function loginUserHandler(
  req: Request<{}, {}, LoginUserInput["body"]>,
  res: Response,
) {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    return res.send({ user, accessToken, refreshToken });
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    if (err instanceof IncorrectPasswordError) {
      return res.status(401).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to login. Please try again.");
  }
}

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response,
) {
  try {
    const user = await createUser(req.body);

    return res.send(user);
  } catch (err: any) {
    if (err instanceof EmailExistsError) {
      return res.status(409).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to create user. Please try again.");
  }
}

export async function deleteUserHandler(
  req: Request<GetUserByIdInput["params"]>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    await deleteUser(userId);

    return res.sendStatus(204);
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to delete user. Please try again.");
  }
}

export async function updateEmailHandler(
  req: Request<GetUserByIdInput["params"], {}, UpdateEmailInput["body"]>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const { newEmail } = req.body;
    await updateEmail(userId, newEmail);

    return res.sendStatus(204);
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to update email. Please try again.");
  }
}

export async function updatePasswordHandler(
  req: Request<GetUserByIdInput["params"], {}, UpdatePasswordInput["body"]>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await updatePassword(userId, newPassword);

    return res.sendStatus(204);
  } catch (err: any) {
    if (err instanceof UserNotFoundError) {
      return res.status(404).send({ ...err, message: err.message });
    }

    return res.status(500).send("Unable to update password. Please try again.");
  }
}
