import { afterEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import createServer from "../../../utils/createServer";
import { getUserByIdHandler } from "../../user.controller";
import { Request, Response } from "express";
import { GetUserByIdInput } from "../../../schema/user.schema";
import UserNotFoundError from "../../../errors/user/UserNotFoundError";

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

    const user = {
      user_id: "1",
      email: "email@email.com",
      email_verified: 0,
    };

    const spy = vi.spyOn(UserService, "getUserById");

    expect(spy.getMockName()).toEqual("getUserById");

    spy.mockResolvedValue(user);

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
    );

    expect(spy).toHaveBeenCalledWith("1");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(user);
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

    const spy = vi.spyOn(UserService, "getUserById");

    expect(spy.getMockName()).toEqual("getUserById");

    const err = new UserNotFoundError(
      "User not found with the provided user ID.",
    );

    spy.mockRejectedValue(err);

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
    );

    expect(spy).toHaveBeenCalledWith("1");
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({
      ...err,
      message: err.message,
    });
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

    const spy = vi.spyOn(UserService, "getUserById");

    expect(spy.getMockName()).toEqual("getUserById");

    spy.mockRejectedValue(new Error("Some error occurred"));

    await getUserByIdHandler(
      request as Request<GetUserByIdInput["params"]>,
      response as Response,
    );

    expect(spy).toHaveBeenCalledWith("1");

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith({
      message: "Could not retrieve user. Please try again.",
    });
  });
});
