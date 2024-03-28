import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as UserService from "../../../service/user.service";
import { updateEmailHandler } from "../../user.controller";
import { Request, Response } from "express";
import {
  GetUserByIdInput,
  UpdateEmailInput,
} from "../../../schema/user.schema";

describe("updateEmailHandler", () => {
  type UpdateEmailMockRequest = Request<
    GetUserByIdInput["params"],
    {},
    UpdateEmailInput["body"]
  >;

  let request: Partial<UpdateEmailMockRequest>;
  let response: Partial<Response>;
  let next = vi.fn();

  beforeEach(() => {
    request = {
      params: {
        userId: "1",
      },
      body: {
        newEmail: "email",
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
    const spy = vi.spyOn(UserService, "updateEmail");

    expect(spy.getMockName()).toEqual("updateEmail");

    spy.mockResolvedValue(true);

    await updateEmailHandler(
      request as UpdateEmailMockRequest,
      response as Response,
      next,
    );

    expect(spy).toHaveBeenCalledWith("1", "email");

    expect(response.sendStatus).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error object if an error occurs", async () => {
    const error = new Error("Some error occurred");
    vi.spyOn(UserService, "updateEmail").mockRejectedValue(error);

    await updateEmailHandler(
      request as UpdateEmailMockRequest,
      response as Response,
      next,
    );

    expect(next).toHaveBeenCalledWith(error);
  });
});
