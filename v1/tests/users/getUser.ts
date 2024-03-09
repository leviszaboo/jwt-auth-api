import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import { exampleUser, apiKey, appId, app, endpoints } from "../helpers/setup";
import { OmitPasswordHash, User } from "../../types/user.types";
import { ZodIssue } from "zod";

export const getUserRouteTest = () =>
  describe("[GET] /api/v1/users/:userId", () => {
    const endpoint = endpoints.GET_USER;

    it("should respond with a `200` status code and user info when a valid api key and app id is present", async () => {
      const loginResponse = await request(app)
        .post(endpoints.LOGIN)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      const loginBody = loginResponse.body;

      const { status, body } = await request(app)
        .get(endpoint.replace(":userId", loginBody.user_id))
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(200);

      expectTypeOf(body).toMatchTypeOf<OmitPasswordHash<User>>();

      expect(body).toMatchObject({
        user_id: loginBody.user_id,
        email: exampleUser.email,
        email_verified: false,
      });
    });

    it("should respond with a `404` status code when the user does not exist", async () => {
      const { status, body } = await request(app)
        .get(
          endpoint.replace(":userId", "00000000-0000-0000-0000-000000000000"),
        )
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(404);

      expect(body).toMatchObject({
        name: "UserNotFoundError",
        message: "User not found with the provided user ID.",
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
      });
    });

    it("should respond with a `400` status code and Zod errors when the user id is invalid", async () => {
      const { status, body } = await request(app)
        .get(endpoint.replace(":userId", "invalid-id"))
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

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
