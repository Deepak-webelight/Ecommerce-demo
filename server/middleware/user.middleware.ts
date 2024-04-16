import { NextFunction, Request, Response } from "express";
import { IResisterRequestbody } from "../routes/user.routes";
import responseProvider from "../utils/responseProvider.utils";

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
}
