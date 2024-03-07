import resetDb from "./reset-db.js";
import { beforeAll } from "vitest";

beforeAll(async () => {
  await resetDb();
});
