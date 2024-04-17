import { NextFunction, Request, Response } from "express";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import responseProvider from "../utils/responseProvider.utils";
import { UserService } from "../services/user.service";
import { emailRegex } from "../utils/constants.utils";

const userService = new UserService();

export class UserMiddleware {
  varifySignupRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Extract user data from request body
    const { email, name, password }: IResisterRequestbody = req.body;

    // Varify does name exist ?
    if (!name)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid name",
        response: res,
        statusCode: 400,
      });

    // Varify does email exist and is in format
    if (!email || !emailRegex.test(email))
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid email",
        response: res,
        statusCode: 400,
      });

    // Varify does password exist
    if (!password)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid password",
        response: res,
        statusCode: 400,
      });

    next();
  }
  varifyLoginRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Extract user data from request body
    const { email, password }: ILoginRequestbody = req.body;

    // verify does email exists and is in right format
    if (!email || !emailRegex.test(email))
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid email",
        response: res,
        statusCode: 400,
      });

    // verify does password exists
    if (!password)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid password",
        response: res,
        statusCode: 400,
      });
    next();
  }
  varifyAuthToken(req: Request, res: Response, next: NextFunction): void {
    // Extract data from headers
    const { authorization } = req.headers;

    // does authorization exist in headers
    if (!authorization) {
      return responseProvider.sendResponse({
        message: "Bad Request | Authorization header is missing",
        response: res,
        statusCode: 400,
      });
    }

    // Extract token from authorization
    const token = authorization.split(" ")[1];

    // Is token exist in authorization
    if (!token) {
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid Token",
        response: res,
        statusCode: 400,
      });
    }

    // call user service to varify token
    const isValidToken = userService.verifyToken(token);

    
    if (isValidToken) {
      next();
    } else {
      return responseProvider.sendResponse({
        message: "Bad Request | Token is invalid or expired",
        response: res,
        statusCode: 400,
        tokenExpire: !isValidToken,
      });
    }
  }
}
