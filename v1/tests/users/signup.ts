import { describe, expect, expectTypeOf, it } from "vitest";
import request from "supertest";
import { ZodIssue } from "zod";
import createServer from "../../utils/createServer";
import config from "config";
import { AuthResponse } from "../../types/user.types";

const app = createServer();
const apiKey = config.get<string>("apiKey");
const appId = config.get<string>("appId");

const exampleUser = {
  email: "test@gator.io",
  password: "testpassword",
};

export const signUpRouteTest = () =>
  describe("[POST] /api/v1/users/sign-up", () => {
    const endpoint = "/api/v1/users/sign-up";

    it("should respond with a `401` status code when no api key or app id is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser);

      expect(status).toBe(401);

      expect(text).toBe("Missing API key.");

      const { status: status2, text: text2 } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey);

      expect(status2).toBe(401);

      expect(text2).toBe("Missing App ID.");
    });

    it("should respond with a `401` status code when an invalid api key or app id is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", "invalid-api-key")
        .set("x-gator-app-id", appId);

      expect(status).toBe(401);

      expect(text).toBe("Provided API Key or App ID is invalid.");

      const { status: status2, text: text2 } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", "invalid-api-key");

      expect(status2).toBe(401);

      expect(text2).toBe("Provided API Key or App ID is invalid.");
    });

    it("should respond with a `200` status code and user info when a valid api key and app id is present", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(200);

      // user_id is uuid: ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$

      expect(body).toMatchObject({
        user_id: expect.stringMatching(
          /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
        ),
        email: exampleUser.email,
        email_verified: false,
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
        name: "EmailExistsError",
        message: "A user with the provided email address already exists.",
        statusCode: 409,
        errorCode: "EMAIL_ALREADY_EXISTS",
      });
    });

    it("should respond with a `400` status code and Zod errors when the request body is invalid", async () => {
      const { status, body } = await request(app)
        .post(endpoint)
        .send({ email: "invalid-email" })
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status).toBe(400);

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
