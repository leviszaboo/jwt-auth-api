import { testAuthMiddleware } from "../middleware/authenticate";
import { signUpRouteTest } from "./signup";
import { loginRouteTest } from "./login";
import { forIn } from "lodash";

import { endpoints } from "../helpers/setup";
import { getUserRouteTest } from "./getUser";

//Check for correct authentication on all routes

forIn(endpoints, (value) => testAuthMiddleware(value));

// Running integration tests in sequential order

signUpRouteTest();

loginRouteTest();

getUserRouteTest();
