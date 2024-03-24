import { testAuthMiddleware } from "../middleware/authenticate";
import { signUpRouteTest } from "./signup";
import { loginRouteTest } from "./login";
import { forIn } from "lodash";

import { Endpoints } from "../../utils/options";
import { getUserRouteTest } from "./getUser";

//Check for correct authentication on all routes

forIn(Endpoints, (value) => testAuthMiddleware(value));

// Running integration tests in sequential order

signUpRouteTest();

loginRouteTest();

getUserRouteTest();
