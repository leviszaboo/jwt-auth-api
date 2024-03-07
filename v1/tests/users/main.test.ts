import { signUpRouteTest } from "./signup";
import { loginRouteTest } from "./login";

// Running integration tests in sequential order

signUpRouteTest();

loginRouteTest();
