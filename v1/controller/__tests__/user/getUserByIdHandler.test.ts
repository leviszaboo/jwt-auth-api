import { afterEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { getUserByIdHandler } from "../../user.controller";
import { Request, Response } from "express";
import { GetUserByIdInput } from "../../../schema/user.schema";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";
import { User } from "../../../types/user.types";

describe("getUserByIdHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and user data", async () => {
    const request: Partial<Request<GetUserByIdInput["params"]>> = {
      params: {
        userId: "1",
      },
    };

    const response: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const next = vi.fn();

    const user: User = {
      userId: "1",
      email: "email@email.com",
      emailVerified: false,
    };

    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");

    expect(getUserByIdSpy.getMockName()).toEqual("getUserById");

    getUserByIdSpy.mockResolvedValue(user);

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
      next,
    );

    expect(getUserByIdSpy).toHaveBeenCalledWith("1");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if user not found", async () => {
    const request: Partial<Request<GetUserByIdInput["params"]>> = {
      params: {
        userId: "1",
      },
    };

    const response: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const next = vi.fn();

    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");

    expect(getUserByIdSpy.getMockName()).toEqual("getUserById");

    const err = new UserNotFoundError(
      "User not found with the provided user ID.",
    );

    getUserByIdSpy.mockRejectedValue(err);

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
      next,
    );

    expect(response.send).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });

  it("should return 500 if other error occurs", async () => {
    const request: Partial<Request<GetUserByIdInput["params"]>> = {
      params: {
        userId: "1",
      },
    };

    const response: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };

    const next = vi.fn();

    const err = new Error("Some error occurred");

    const getUserByIdSpy = vi.spyOn(UserService, "getUserById");

    expect(getUserByIdSpy.getMockName()).toEqual("getUserById");

    getUserByIdSpy.mockRejectedValue(err);

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
      next,
    );

    expect(getUserByIdSpy).toHaveBeenCalledWith("1");

    expect(response.send).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });
});
