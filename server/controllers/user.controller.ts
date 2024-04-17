import { Request, Response } from "express";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import { IgenerateToken, UserService } from "../services/user.service";
import responseProvider from "../utils/responseProvider.utils";
import { tokenFormat } from "../utils/constants.utils";

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

      // Call user service to generate tokens
      const { token, refreshToken } = userService.generateTokens(newUser._id);

      return responseProvider.sendResponse({
        message: "User Created Successfully",
        response: res,
        statusCode: 200,
        cookie: [
          {
            name: "token",
            value: tokenFormat(token),
          },
          { name: "refreshToken", value: tokenFormat(refreshToken) },
        ],
      });
    } catch (err) {
      // send error response if resister failed
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
        message: (err as Error).message,
      });
    }
  }
  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: ILoginRequestbody = req.body;

      // call user service to validate user credentials
      const user = await userService.validiateUser({ email, password });

      // Call user service to generate tokens
      const { token, refreshToken } = userService.generateTokens(user._id);

      return responseProvider.sendResponse({
        message: "Login Successful",
        response: res,
        statusCode: 200,
        cookie: [
          {
            name: "token",
            value: tokenFormat(token),
          },
          { name: "refreshToken", value: tokenFormat(refreshToken) },
        ],
      });
    } catch (err) {
      // send error response if login failed
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
        message: (err as Error).message,
      });
    }
  }
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const authorization = req.headers.authorization as string;
      const token = authorization?.split(" ")[1];

      // call user service to extract data from token
      const { userId } = userService.verifyToken(token) as IgenerateToken;

      // call user service to retrieve new token
      const newToken = userService.createNewToken(userId, "1d");

      return responseProvider.sendResponse({
        message: "token refreshed",
        response: res,
        statusCode: 200,
        data: {
          token: newToken,
        },
      });
    } catch (err) {
      return responseProvider.InternalServerError({
        error: err as Error,
        response: res,
      });
    }
  }
  async userLogout(req: Request, res: Response) {
    try {
      
      //  clear cookies 
      responseProvider.clearCookies({
        name: "token",
        response: res,
      });
      responseProvider.clearCookies({
        name: "refreshToken",
        response: res,
      });
      return responseProvider.sendResponse({
        message: "logout successfully",
        response: res,
        statusCode: 200,
      });
    } catch (err) {
      return responseProvider.InternalServerError({
        error: err as Error,
        response: res,
      });
    }
  }
}
