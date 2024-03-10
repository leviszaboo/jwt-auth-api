import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import { AuthResponse } from "../../types/user.types";
import { exampleUser, apiKey, appId, app, endpoints } from "../helpers/setup";
import { ZodIssue } from "zod";

export const loginRouteTest = () =>
  describe("[POST] /api/v1/users/login", () => {
    const endpoint = endpoints.LOGIN;

    it("should respond with a `200` status code and user info when a valid api key and app id is present", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(200);

      expectTypeOf(body).toMatchTypeOf<AuthResponse>();

      expect(body).toMatchObject({
        userId: expect.stringMatching(
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
        ),
        email: exampleUser.email,
        emailVerified: false,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it("should respond with a `404` status code when the user does not exist", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send({ email: "faulty@gator.io", password: "testpassword" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(404);

      expect(body).toMatchObject({
        name: "UserNotFoundError",
        message: "User not found with the provided email address.",
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
      });
    });

    it("should respond with a `400` status code and Zod errors when the user input is invalid", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send({ email: "invalid-email", password: "testpassword" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(400);

      expectTypeOf(body).toMatchTypeOf<ZodIssue[]>();

      expect(body).toMatchObject([
        {
          code: "invalid_string",
          message: "Please enter a valid email adress",
          path: ["body", "email"],
          validation: "email",
        },
      ]);
    });
  });
