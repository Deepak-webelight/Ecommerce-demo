import { NextFunction, Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import { ILoginRequestbody } from "../../../routes/auth";
import UserModel from "../../../model/userModel";

const varifyUserDoesNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email }: ILoginRequestbody = req.body;

    const isUserExist = await UserModel.exists({ Email });
    console.log("isUserExist", isUserExist);
    if (isUserExist) next();
    else
     return responseProvider.sendResponse({
        message: "User does not exist",
        response: res,
        statusCode: 400,
      });
  } catch (err) {
    console.log(err);
    return responseProvider.InternalServerError({
      error: err as Error,
      response: res,
    });
  }
};
export default varifyUserDoesNotExist;
