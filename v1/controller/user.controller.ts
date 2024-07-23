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
import asyncHandler from "express-async-handler";

export const getUserByIdHandler = asyncHandler(
  async (req: Request<GetUserByIdInput["params"]>, res: Response) => {
    const { userId } = req.params;
    const user = await getUserById(userId);

    res.status(200).send(user);
  },
);

export const loginUserHandler = asyncHandler(
  async (req: Request<{}, {}, LoginUserInput["body"]>, res: Response) => {
    const authResponseData = await loginUser(req.body);

    res.status(200).send(authResponseData);
  },
);

export const createUserHandler = asyncHandler(
  async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
    const user = await createUser(req.body);

    res.status(200).send(user);
  },
);

export const deleteUserHandler = asyncHandler(
  async (req: Request<GetUserByIdInput["params"]>, res: Response) => {
    const { userId } = req.params;
    await deleteUser(userId);

    res.sendStatus(204);
  },
);

export const updateEmailHandler = asyncHandler(
  async (
    req: Request<GetUserByIdInput["params"], {}, UpdateEmailInput["body"]>,
    res: Response,
  ) => {
    const { userId } = req.params;
    const { newEmail } = req.body;
    await updateEmail(userId, newEmail);

    res.sendStatus(204);
  },
);

export const updatePasswordHandler = asyncHandler(
  async (
    req: Request<GetUserByIdInput["params"], {}, UpdatePasswordInput["body"]>,
    res: Response,
  ) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    await updatePassword(userId, newPassword);

    res.sendStatus(204);
  },
);
