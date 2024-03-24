import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import { exampleUser, apiKey, appId, app } from "../helpers/setup";
import { Endpoints } from "../../utils/options";
import { ZodIssue } from "zod";
import { User } from "../../types/user.types";

export const signUpRouteTest = () =>
  describe("[POST] /api/v1/users/sign-up", () => {
    const endpoint = Endpoints.SIGNUP;

    it("should respond with a `200` status code and user info when a valid api key and app id is present", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(200);

      expectTypeOf(body).toMatchTypeOf<User>();

      // userId is uuid: ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$
      expect(body).toMatchObject({
        userId: expect.stringMatching(
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
        ),
        email: exampleUser.email,
        emailVerified: false,
      });
    });

    it("should respond with a `409` status code when the email already exists", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(409);

      expect(body).toMatchObject({
        error: {
          name: "EmailExistsError",
          message: `A user with the email address ${exampleUser.email} already exists.`,
          errorCode: "EMAIL_ALREADY_EXISTS",
        },
      });
    });

    it("should respond with a `400` status code and Zod errors when the request body is invalid", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send({ email: "invalid-email" })
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
        {
          code: "invalid_type",
          expected: "string",
          message: "Password is a required field.",
          path: ["body", "password"],
          received: "undefined",
        },
      ]);
    });
  });
