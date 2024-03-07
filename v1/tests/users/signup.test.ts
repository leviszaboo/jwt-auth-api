import { describe, expect, it } from "vitest";
import request from "supertest";
import createServer from "../../utils/createServer";
import config from "config";

const app = createServer();
const apiKey = config.get<string>("apiKey");
const appId = config.get<string>("appId");

describe("/users", async () => {
  const exampleUser = {
    email: "test@gator.io",
    password: "testpassword",
  };

  describe("[POST] /api/v1/users/sign-up", () => {
    const endpoint = "/api/v1/users/sign-up";

    it("should respond with a `401` status code when no api key or app id is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser);

      expect(status).toBe(401);

      expect(text).toStrictEqual("Missing API key.");

      const { status: status2, text: text2 } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey);

      expect(status2).toBe(401);

      expect(text2).toStrictEqual("Missing App ID.");
    });

    it("should respond with a `401` status code when an invalid api key or app id is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", "invalid-api-key")
        .set("x-gator-app-id", appId);

      expect(status).toBe(401);

      expect(text).toStrictEqual("Provided API Key or App ID is invalid.");

      const { status: status2, text: text2 } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", "invalid-api-key");

      expect(status2).toBe(401);

      expect(text2).toStrictEqual("Provided API Key or App ID is invalid.");
    });

    it("should respond with a `200` status code and user info when a valid api key and app id is present and a `409` status code when the email already exists", async () => {
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

      const { status: status2, body: body2 } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", apiKey)
        .set("x-gator-app-id", appId);

      expect(status2).toBe(409);

      expect(body2).toMatchObject({
        name: "EmailExistsError",
        message: "A user with the provided email address already exists.",
        statusCode: 409,
        errorCode: "EMAIL_ALREADY_EXISTS",
      });
    });
  });
});
