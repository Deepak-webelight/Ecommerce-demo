import { Router } from "express";
import AddNewUserHandler from "../../controller/auth/AddNewUserHandler";
import varifySignupRequestBody from "../../middleware/auth/varifySignupRequestBody";
import varifyUserAlreadyExist from "../../middleware/auth/varifyUserAlreadyExist";
import varifyLoginRequestBody from "../../middleware/varifyLoginRequestBody";
import UserLoginController from "../../controller/auth/UserLoginController";
import varifyUserDoesNotExist from "../../middleware/auth/varifyUserDoesNotExist";

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

export default authRoutes;
