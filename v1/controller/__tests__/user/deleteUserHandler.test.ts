import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { deleteUserHandler } from "../../user.controller";
import { Request, Response } from "express";
import { GetUserByIdInput } from "../../../schema/user.schema";

describe("deleteUserHandler", () => {
  type DeleteUserMockRequest = Request<GetUserByIdInput["params"]>;

  let request: Partial<DeleteUserMockRequest>;
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
      sendStatus: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send 204", async () => {
    const spy = vi.spyOn(UserService, "deleteUser");

    expect(spy.getMockName()).toEqual("deleteUser");

    spy.mockResolvedValue(true);

    await deleteUserHandler(
      request as DeleteUserMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith("1");
    expect(response.sendStatus).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "deleteUser").mockRejectedValue(error);

    await deleteUserHandler(
      request as DeleteUserMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.sendStatus).not.toHaveBeenCalled();
  });
});
