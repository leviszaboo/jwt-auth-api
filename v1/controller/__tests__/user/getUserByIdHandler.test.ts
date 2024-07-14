import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { getUserByIdHandler } from "../../user.controller";
import { Request, Response } from "express";
import { GetUserByIdInput } from "../../../schema/user.schema";
import { User } from "../../../types/user.types";

describe("getUserByIdHandler", () => {
  type GetUserByIdMockRequest = Request<GetUserByIdInput["params"]>;
  let request: Partial<GetUserByIdMockRequest>;
  let response: Partial<Response>;
  let next = vi.fn();

  beforeEach(() => {
    request = {
      params: {
        userId: "1",
      },
    };
    response = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and user data", async () => {
    const user: User = {
      userId: "1",
      email: "email@email.com",
      emailVerified: false,
    };

    const spy = vi.spyOn(UserService, "getUserById");

    expect(spy.getMockName()).toEqual("getUserById");

    spy.mockResolvedValue(user);

    await getUserByIdHandler(
      request as GetUserByIdMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith("1");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "getUserById").mockRejectedValue(error);

    await getUserByIdHandler(
      request as GetUserByIdMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.send).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
  });
});
