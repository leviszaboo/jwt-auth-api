import { testAuthMiddleware } from "../middleware/authenticate";
import { signUpRouteTest } from "./signup";
import { loginRouteTest } from "./login";
import { updateEmailRouteTest } from "./updateEmail";
import { forIn } from "lodash";

import { Endpoints } from "../../utils/options";
import { getUserRouteTest } from "./getUser";
import { exampleUser, exampleUser2 } from "../helpers/setup";
import { describe, it } from "vitest";
import { updatePasswordRouteTest } from "./updatePassword";

//Check for correct authentication on all routes

// forIn(Endpoints, (value) => testAuthMiddleware(value));

// Running integration tests in sequential order

async function runTests() {
  // signup
  testAuthMiddleware(Endpoints.SIGNUP, "post", exampleUser);
  signUpRouteTest();

  // Test get user with the obtained token and userId
  testAuthMiddleware(Endpoints.GET_USER, "get");
  getUserRouteTest();

  // update email
  testAuthMiddleware(Endpoints.UPDATE_EMAIL, "put", exampleUser.email);
  updateEmailRouteTest();

  testAuthMiddleware(Endpoints.UPDATE_PASSWORD, "put", exampleUser.password);
  updatePasswordRouteTest();

  // login
  testAuthMiddleware(Endpoints.LOGIN, "post", exampleUser);
  loginRouteTest();

  testAuthMiddleware(Endpoints.DELETE_USER, "delete");

  testAuthMiddleware(Endpoints.INVALIDATE_TOKEN, "post", "token");

  testAuthMiddleware(Endpoints.REISSUE_TOKEN, "post", "token");
}

runTests();
