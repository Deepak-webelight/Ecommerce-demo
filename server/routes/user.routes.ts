import { Router } from "express";
import { UserMiddleware } from "../middleware/user.middleware";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const usermiddlware = new UserMiddleware();
const userController = new UserController();

// user sign-up route
export interface IResisterRequestbody {
  name: string;
  email: string;
  password: string;
}

userRoutes.post(
  "/sign-up",
  usermiddlware.varifySignupRequestBody,
  userController.resisterNewUser
);

// user Login route
export interface ILoginRequestbody {
  Email: string;
  Password: string;
}
userRoutes.post(
  "/login"
  //   varifyLoginRequestBody,
  //   varifyUserDoesNotExist,
  //   UserLoginController
);

// user logout route
userRoutes.get(
  "/logout"
  // varifyAuthToken, UserLogoutController
);

// refresh token route
userRoutes.get(
  "/refresh"
  // varifyAuthToken, UserRefreshTokenController
);

export default userRoutes;
