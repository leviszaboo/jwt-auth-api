import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import { exampleUser2, apiKey, appId, app } from "../helpers/setup";
import { Endpoints } from "../../utils/options";
import { User } from "../../types/user.types";
import { ZodIssue } from "zod";

export const getUserRouteTest = () =>
  describe("[GET] /api/v1/users/:userId", () => {
    const endpoint = Endpoints.GET_USER;

    it("should respond with a `200` status code and user info when a valid api key is present", async () => {
      const { status, body } = await request(app)
        .get(endpoint.replace(":userId", exampleUser2.userId))
        .set("x-gator-api-key", apiKey);

      expect(status).toBe(200);

      expectTypeOf(body).toMatchTypeOf<User>();

      expect(body).toMatchObject({
        userId: exampleUser2.userId,
        email: exampleUser2.email,
        emailVerified: false,
      });
    });

    it("should respond with a `404` status code when the user does not exist", async () => {
      const invalidUserId = "00000000-0000-0000-0000-000000000000";
      const { status, body } = await request(app)
        .get(endpoint.replace(":userId", invalidUserId))
        .set("x-gator-api-key", apiKey);

      expect(status).toBe(404);

      expect(body).toMatchObject({
        error: {
          name: "UserNotFoundError",
          message: `User not found with ID: ${invalidUserId}`,
          errorCode: "USER_NOT_FOUND",
        },
      });
    });

    it("should respond with a `400` status code and Zod errors when the user id is invalid", async () => {
      const { status, body } = await request(app)
        .get(endpoint.replace(":userId", "invalid-id"))
        .set("x-gator-api-key", apiKey);

      expect(status).toBe(400);

      expectTypeOf(body).toMatchTypeOf<ZodIssue[]>();

      expect(body).toMatchObject([
        {
          code: "invalid_string",
          message: "ID must be a valid UUID.",
          path: ["params", "userId"],
          validation: "regex",
        },
      ]);
    });
  });
