import { NextFunction, Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import { IsignupRequestbody } from "../../../routes/auth";

const varifySignupRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email, Name, Password }: IsignupRequestbody = req.body;

    if (!Name)
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid Name",
        response: res,
        statusCode: 400,
      });

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
  } catch {
    return responseProvider.InternalServerError({ response: res });
  }
};

export default varifySignupRequestBody;
