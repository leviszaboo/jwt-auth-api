import resetDb from "./reset-db.js";
import { beforeAll } from "vitest";
import config from "config";
import createServer from "../../utils/createServer.js";
import { UserInput } from "../../types/user.types.js";

export const exampleUser: UserInput = {
  email: "test@gator.io",
  password: "testpassword",
};

export const app = createServer();

export const apiKey = config.get<string>("apiKey");
export const appId = config.get<string>("appId");

export enum endpoints {
  SIGNUP = "/api/v1/users/sign-up",
  LOGIN = "/api/v1/users/login",
  GET_USER = "/api/v1/users/:userId",
  UPDATE_EMAIL = "/api/v1/users/update-email",
  UPDATE_PASSWORD = "/api/v1/users/update-password",
  SEND_VERIFICATION_EMAIL = "/api/v1/users/send-verification-email",
  VERIFY_EMAIL = "/api/v1/users/verify-email",
  DELETE_USER = "/api/v1/users/:userId",
  REISSUE_TOKEN = "/api/v1/tokens/reissue-token",
  INVALIDATE_TOKEN = "/api/v1/tokens/invalidate-token",
}

beforeAll(async () => {
  await resetDb();
});
