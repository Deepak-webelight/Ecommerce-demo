import { NextFunction, Request, Response } from "express";
import { ILoginRequestbody, IResisterRequestbody } from "../routes/user.routes";
import responseProvider from "../utils/responseProvider.utils";
import tokenHandler from "../utils/tokenHandler.utils";

export class UserMiddleware {
  async varifySignupRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract user data from request body
      const { email, name, password }: IResisterRequestbody = req.body;

      // validate name, email and password
      if (!name)
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid name",
          response: res,
          statusCode: 400,
        });

      if (!email)
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid email",
          response: res,
          statusCode: 400,
        });
      if (!password)
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid password",
          response: res,
          statusCode: 400,
        });

      next();
    } catch (err) {
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
      });
    }
  }
  async varifyLoginRequestBody(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract user data from request body
      const { email, password }: ILoginRequestbody = req.body;

      // validate email and password
      if (!email)
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid email",
          response: res,
          statusCode: 400,
        });
      if (!password)
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid password",
          response: res,
          statusCode: 400,
        });

      next();
    } catch (err) {
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
      });
    }
  }
  async varifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract user data from headers
      const { authorization } = req.headers;

      // validate authorization
      if (!authorization) {
        return responseProvider.sendResponse({
          message: "Bad Request | Authorization header is missing",
          response: res,
          statusCode: 400,
        });
      }

      // Extract token from authorization
      const token = authorization.split(" ")[1];

      // validate token
      if (!token) {
        return responseProvider.sendResponse({
          message: "Bad Request | Invalid Token",
          response: res,
          statusCode: 400,
        });
      }
      const isValidToken = await tokenHandler.verifyToken(token);

      if (isValidToken) {
        next();
      } else {
        return responseProvider.sendResponse({
          message: "Bad Request | Token is invalid or expired",
          response: res,
          statusCode: 400,
          tokenExpire: !!isValidToken,
        });
      }
    } catch (err) {
      return responseProvider.InternalServerError({
        response: res,
        error: err as Error,
      });
    }
  }
}
