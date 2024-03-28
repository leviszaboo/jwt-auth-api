import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { createUserHandler } from "../../user.controller";
import { Request, Response } from "express";
import { CreateUserInput } from "../../../schema/user.schema";
import { User } from "../../../types/user.types";

describe("createUserHandler", () => {
  type CreateUserMockRequest = Request<{}, {}, CreateUserInput["body"]>;

  let request: Partial<CreateUserMockRequest>;
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

  it("should send 200 and user data", async () => {
    const user: User = {
      userId: "1",
      email: "email",
      emailVerified: false,
    };

    const spy = vi.spyOn(UserService, "createUser");

    expect(spy.getMockName()).toEqual("createUser");

    spy.mockResolvedValue(user);

    await createUserHandler(
      request as CreateUserMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith(request.body);
    expect(response.send).toHaveBeenCalledWith(user);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "createUser").mockRejectedValue(error);

    await createUserHandler(
      request as CreateUserMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.send).not.toHaveBeenCalled();
  });
});
