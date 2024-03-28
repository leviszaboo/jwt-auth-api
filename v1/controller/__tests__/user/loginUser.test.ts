import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { loginUserHandler } from "../../user.controller";
import { Request, Response } from "express";
import { LoginUserInput } from "../../../schema/user.schema";
import { AuthResponse } from "../../../types/user.types";

describe("loginUserHandler", () => {
  type LoginUserMockRequest = Request<{}, {}, LoginUserInput["body"]>;

  let request: Partial<LoginUserMockRequest>;
  let response: Partial<Response>;
  let next = vi.fn();

  beforeEach(() => {
    request = {
      body: {
        email: "email",
        password: "password",
      },
    };
    response = {
      send: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send 200 and auth response data", async () => {
    const authResponseData: AuthResponse = {
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      userId: "1",
      email: "email",
      emailVerified: false,
    };

    const spy = vi.spyOn(UserService, "loginUser");

    expect(spy.getMockName()).toEqual("loginUser");

    spy.mockResolvedValue(authResponseData);

    await loginUserHandler(
      request as LoginUserMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith(request.body);
    expect(response.send).toHaveBeenCalledWith(authResponseData);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "loginUser").mockRejectedValue(error);

    await loginUserHandler(
      request as LoginUserMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });
});
