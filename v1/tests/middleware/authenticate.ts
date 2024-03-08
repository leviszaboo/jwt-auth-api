import { describe, it, expect } from "vitest";
import request from "supertest";
import { exampleUser, apiKey, appId, app } from "../helpers/setup";

export const testAuthMiddleware = (endpoint: string) =>
  describe(`[MIDDLEWARE] authenticate ${endpoint}`, () => {
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
  });
