import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { apiKey, app } from "../helpers/setup";
import { Endpoints } from "../../utils/options";

export const updateEmailRouteTest = () =>
  describe("[PUT] /api/v1/users/:userId/update-email", () => {
    const endpoint = Endpoints.UPDATE_EMAIL;

    let userId: string;
    let accessToken: string;
    const testUser = {
      email: `test-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`,
      password: "TestPassword123!",
    };

    beforeAll(async () => {
      const signupResponse = await request(app)
        .post(Endpoints.SIGNUP)
        .send(testUser)
        .set("x-gator-api-key", apiKey);

      expect(signupResponse.status).toBe(200);
      console.log(`Created new test user: ${testUser.email}`);

      const loginResponse = await request(app)
        .post(Endpoints.LOGIN)
        .send(testUser)
        .set("x-gator-api-key", apiKey);

      expect(loginResponse.status).toBe(200);

      userId = loginResponse.body.userId;
      accessToken = loginResponse.body.accessToken;
    });

    it("should respond with a `204` status code when a valid api key is present", async () => {
      const { status, body } = await request(app)
        .put(endpoint.replace(":userId", userId))
        .send({
          newEmail: `test-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`,
        })
        .set("x-gator-api-key", apiKey)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(status).toBe(204);
    });

    // TODO
  });
