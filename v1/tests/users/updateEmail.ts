import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import {
  exampleUser2,
  exampleUser,
  apiKey,
  appId,
  app,
} from "../helpers/setup";
import { Endpoints } from "../../utils/options";
import { ZodIssue } from "zod";

export const updateEmailRouteTest = () =>
  describe("[PUT] /api/v1/users/:userId/update-email", () => {
    const endpoint = Endpoints.UPDATE_EMAIL;

    it("should respond with a `204` status code when a valid api key is present", async () => {
      const { status } = await request(app)
        .put(endpoint.replace(":userId", exampleUser2.userId))
        .send({ newEmail: "newEmail@gator.io" })
        .set("x-gator-api-key", apiKey);

      expect(status).toBe(204);
    });

    it("should respond with a `404` status code when the user does not exist", async () => {
      const invalidUserId = "00000000-0000-0000-0000-000000000000";
      const { status, body } = await request(app)
        .put(endpoint.replace(":userId", invalidUserId))
        .send({ newEmail: "newEmail@gator.io" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(404);

      expect(body).toMatchObject({
        error: {
          name: "UserNotFoundError",
          message: `User not found with ID: ${invalidUserId}`,
          errorCode: "USER_NOT_FOUND",
        },
      });
    });

    it("should respond with a `400` status code and Zod errors when the request body is invalid", async () => {
      const { status, body } = await request(app)
        .put(endpoint.replace(":userId", exampleUser2.userId))
        .send({ newEmail: "invalid-email" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(400);

      expectTypeOf(body).toMatchTypeOf<ZodIssue[]>();

      expect(body).toMatchObject([
        {
          validation: "email",
          code: "invalid_string",
          message: "Please enter a valid email address.",
          path: ["body", "newEmail"],
        },
      ]);
    });

    it("should respond with a `400` status code and Zod errors when the user id is invalid", async () => {
      const { status, body } = await request(app)
        .put(endpoint.replace(":userId", "invalid-id"))
        .send({ newEmail: "newEmail@gator.io" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      console.log(status, body);

      expect(status).toBe(400);

      expectTypeOf(body).toMatchTypeOf<ZodIssue[]>();

      expect(body).toMatchObject([
        {
          validation: "regex",
          code: "invalid_string",
          message: "ID must be a valid UUID.",
          path: ["params", "userId"],
        },
      ]);
    });
  });
