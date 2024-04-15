import { Router } from "express";
import AddNewUserHandler from "../../controller/auth/AddNewUserHandler";
import varifySignupRequestBody from "../../middleware/auth/varifySignupRequestBody";
import varifyUserAlreadyExist from "../../middleware/auth/varifyUserAlreadyExist";

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

export default authRoutes;
