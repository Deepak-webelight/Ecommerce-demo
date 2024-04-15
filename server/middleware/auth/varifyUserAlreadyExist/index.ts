import { NextFunction, Request, Response } from "express";
import { IsignupRequestbody } from "../../../routes/auth";
import UserModel from "../../../model/userModel";
import responseProvider from "../../../utils/responseProvider";

const varifyUserAlreadyExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email }: IsignupRequestbody = req.body;

    const response = await UserModel.findOne({ Email });

    if (!response) return next();
    else
      return responseProvider.sendResponse({
        message: "User already exists",
        response: res,
        statusCode: 400,
      });
  } catch {
    return responseProvider.InternalServerError({ response: res });
  }
};

export default varifyUserAlreadyExist;
