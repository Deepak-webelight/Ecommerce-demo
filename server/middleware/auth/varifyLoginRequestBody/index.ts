import { NextFunction, Request, Response } from "express";
import { ILoginRequestbody } from "../../../routes/auth";
import responseProvider from "../../../utils/responseProvider";

const varifyLoginRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email, Password }: ILoginRequestbody = req.body;

    if (!Email)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid Email",
        response: res,
        statusCode: 400,
      });
    if (!Password)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid Password",
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
};

export default varifyLoginRequestBody;
