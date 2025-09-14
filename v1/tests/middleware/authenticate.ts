import { describe, it, expect } from "vitest";
import request from "supertest";
import { exampleUser, app } from "../helpers/setup";

type Method = "post" | "get" | "put" | "delete";

export const testAuthMiddleware = (
  endpoint: string,
  method: Method,
  payload?: any,
) =>
  describe(`[MIDDLEWARE] authenticate ${endpoint}`, () => {
    it("should respond with a `401` status code when no api key is present", async () => {
      const req = request(app)[method](endpoint);
      if (method === "post" || method === "put") {
        req.send(payload);
      }
      const { status, text } = await req;

      expect(status).toBe(401);
      expect(text).toBe("Missing API key.");
    });

    it("should respond with a `401` status code when an invalid api key is present", async () => {
      const req = request(app)
        [method](endpoint)
        .set("x-gator-api-key", "invalid-api-key");
      if (method === "post" || method === "put") {
        req.send(payload);
      }
      const { status, text } = await req;

      expect(status).toBe(401);
      expect(text).toBe("Provided API Key is invalid.");
    });
  });
