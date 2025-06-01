import { describe, it, expect } from "vitest";
import request from "supertest";
import { exampleUser, apiKey, appId, app } from "../helpers/setup";

export const testAuthMiddleware = (endpoint: string) =>
  describe(`[MIDDLEWARE] authenticate ${endpoint}`, () => {
    it("should respond with a `401` status code when no api key is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser);

      expect(status).toBe(401);

      expect(text).toBe("Missing API key.");
    });

    it("should respond with a `401` status code when an invalid api key is present", async () => {
      const { status, text } = await request(app)
        .post(endpoint)
        .send(exampleUser)
        .set("x-gator-api-key", "invalid-api-key");

      expect(status).toBe(401);

      expect(text).toBe("Provided API Key is invalid.");
    });
  });
