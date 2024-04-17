import { Request, Response } from "express";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import { UserService } from "../services/user.service";
import responseProvider from "../utils/responseProvider.utils";
import {
  IgenerageTokenInput,
  generageToken,
  verifyToken,
} from "../utils/tokenHandler.utils";
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

      // create new token
      const token = generageToken({
        userId: newUser._id,
        expiresIn: "2h",
      });

      // create new token
      const refreshToken = generageToken({
        userId: newUser._id,
        expiresIn: "3m",
      });

      return responseProvider.sendResponse({
        message: "User Created Successfully",
        response: res,
        statusCode: 200,
        cookie: [
          {
            name: "refreshToken",
            value: tokenFormat(refreshToken),
            cookieOptions: { httpOnly: true, sameSite: "strict" },
          },
          {
            name: "token",
            value: tokenFormat(refreshToken),
            cookieOptions: { httpOnly: true, sameSite: "strict" },
          },
        ],
      });
    } catch (err) {
      console.log(err);
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
      });
    }
  }
  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: ILoginRequestbody = req.body;

      const user = await userService.validiateUser({ email, password });

      if (user instanceof Error) {
        return responseProvider.sendResponse({
          message: user.message,
          response: res,
          statusCode: 400,
        });
      }

      // create new token
      const token = generageToken({
        userId: user._id,
        expiresIn: "2h",
      });

      // create new token
      const refreshToken = generageToken({
        userId: user._id,
        expiresIn: "3m",
      });

      return responseProvider.sendResponse({
        message: "Login Successful",
        response: res,
        statusCode: 200,
        cookie: [
          {
            name: "refreshToken",
            value: tokenFormat(refreshToken),
            cookieOptions: { httpOnly: true, sameSite: "strict" },
          },
          {
            name: "token",
            value: tokenFormat(refreshToken),
            cookieOptions: { httpOnly: true, sameSite: "strict" },
          },
        ],
      });
    } catch (err) {
      console.log(err);
      return responseProvider.InternalServerError({
        error: err as Error,
        response: res,
      });
    }
  }
  async userLogout(req: Request, res: Response): Promise<void> {
    try {
      const { authorization } = req.headers;
      const token = (authorization as string)?.split(" ")[1];

      responseProvider.clearCookies({ name: "refreshToken", response: res });
      responseProvider.clearCookies({ name: "token", response: res });

      return responseProvider.sendResponse({
        message: "Logout Successful",
        response: res,
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return responseProvider.InternalServerError({
        error: err as Error,
        response: res,
      });
    }
  }
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { authorization } = req.headers;

      const token = (authorization as string)?.split(" ")[1];

      const tokenData = verifyToken(token) as IgenerageTokenInput;

      const newToken = generageToken({
        userId: tokenData.userId,
        expiresIn: "2h",
      });

      return responseProvider.sendResponse({
        message: "token refreshed",
        response: res,
        statusCode: 200,
        cookie: [
          {
            name: "token",
            value: tokenFormat(newToken),
            cookieOptions: { httpOnly: true, sameSite: "strict" },
          },
        ],
      });
    } catch (err) {
      return responseProvider.InternalServerError({
        error: err as Error,
        response: res,
      });
    }
  }
}
