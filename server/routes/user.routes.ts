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
  email: string;
  password: string;
}
userRoutes.post(
  "/login",
  usermiddlware.varifyLoginRequestBody,
  userController.userLogin
);

// user logout route
userRoutes.post(
  "/logout",
  usermiddlware.varifyAuthToken,
  userController.userLogout
);

// refresh token route
userRoutes.post(
  "/refresh",
  usermiddlware.varifyAuthToken,
  userController.refreshToken
);

export default userRoutes;
