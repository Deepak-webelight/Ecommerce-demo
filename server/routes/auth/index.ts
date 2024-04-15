import { Router } from "express";
import AddNewUserHandler from "../../controller/auth/AddNewUserHandler";
import varifySignupRequestBody from "../../middleware/auth/varifySignupRequestBody";
import varifyUserAlreadyExist from "../../middleware/auth/varifyUserAlreadyExist";
import UserLoginController from "../../controller/auth/UserLoginController";
import varifyUserDoesNotExist from "../../middleware/auth/varifyUserDoesNotExist";
import varifyLoginRequestBody from "../../middleware/auth/varifyLoginRequestBody";
import varifyAuthToken from "../../middleware/auth/varifyAuthToken";
import UserLogoutController from "../../controller/auth/UserLogoutController";
import UserRefreshTokenController from "../../controller/auth/UserRefreshTokenController";

const authRoutes = Router();

// user signup route
export interface IsignupRequestbody {
  Name: string;
  Email: string;
  Password: string;
}

authRoutes.post(
  "/signup",
  varifySignupRequestBody,
  varifyUserAlreadyExist,
  AddNewUserHandler
);

// user Login route
export interface ILoginRequestbody {
  Email: string;
  Password: string;
}
authRoutes.post(
  "/login",
  varifyLoginRequestBody,
  varifyUserDoesNotExist,
  UserLoginController
);

// user logout route
authRoutes.get("/logout", varifyAuthToken, UserLogoutController);

// refresh token route
authRoutes.get("/refresh", varifyAuthToken, UserRefreshTokenController);

export default authRoutes;
