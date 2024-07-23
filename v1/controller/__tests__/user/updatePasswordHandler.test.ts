import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { updatePasswordHandler } from "../../user.controller";
import { Request, Response } from "express";
import {
  GetUserByIdInput,
  UpdatePasswordInput,
} from "../../../schema/user.schema";

describe("updatePasswordHandler", () => {
  type UpdatePasswordMockRequest = Request<
    GetUserByIdInput["params"],
    {},
    UpdatePasswordInput["body"]
  >;

  let request: Partial<UpdatePasswordMockRequest>;
  let response: Partial<Response>;
  let next = vi.fn();

  beforeEach(() => {
    request = {
      params: {
        userId: "1",
      },
      body: {
        newPassword: "password",
      },
    };
    response = {
      sendStatus: vi.fn(),
    };
    next = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send 204 on success", async () => {
    const spy = vi.spyOn(UserService, "updatePassword");

    expect(spy.getMockName()).toEqual("updatePassword");

    spy.mockResolvedValue(true);

    await updatePasswordHandler(
      request as UpdatePasswordMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith("1", "password");

    expect(response.sendStatus).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "updatePassword").mockRejectedValue(error);

    await updatePasswordHandler(
      request as UpdatePasswordMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
