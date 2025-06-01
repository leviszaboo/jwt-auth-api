import resetDb from "./reset-db.js";
import { beforeAll } from "vitest";
import { createServer } from "../../utils/express.utils.js";
import { UserInput, User } from "../../types/user.types.js";
import { Config } from "../../utils/options.js";

export const exampleUser: UserInput = {
  email: "test@gator.io",
  password: "testpassword",
};

export const exampleUser2: User = {
  userId: "00000000-0000-0000-0000-000000000001",
  email: "test2@gator.io",
  emailVerified: false,
};

export const app = createServer();

export const apiKey = Config.API_KEY;
export const appId = Config.APP_ID;

beforeAll(async () => {
  await resetDb();
});
