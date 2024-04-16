import { Request, Response } from "express";
import { IResisterRequestbody } from "../routes/user.routes";
import { UserService } from "../services/user.service";
import responseProvider from "../utils/responseProvider.utils";
import tokenHandler from "../utils/tokenHandler.utils";

const userService = new UserService();

export class UserController {
  async resisterNewUser(req: Request, res: Response): Promise<void> {
    try {
      // Extract data from request body
      const { email, name, password }: IResisterRequestbody = req.body;

      // call user service to register new user
      const newUser = await userService.resisterNewUser({
        name,
        email,
        password,
      });

      // if user service have some error
      if (newUser instanceof Error) {
        return responseProvider.sendResponse({
          message: newUser.message,
          response: res,
          statusCode: 400,
        });
      }

      // create new token
      const token = tokenHandler.generageToken({
        userId: newUser._id,
      });

      return responseProvider.sendResponse({
        message: "User Created Successfully",
        response: res,
        statusCode: 200,
        data: {
          access_token: token,
        },
      });
    } catch (err) {
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
      });
    }
  }
}
