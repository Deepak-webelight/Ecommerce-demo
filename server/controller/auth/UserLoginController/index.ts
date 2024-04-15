import { Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import { ILoginRequestbody } from "../../../routes/auth";
import UserModel from "../../../model/userModel";
import tokenHandler from "../../../utils/tokenHandler";

const UserLoginController = async (req: Request, res: Response) => {
  try {
    const { Email, Password }: ILoginRequestbody = req.body;

    const CurrentUser = await UserModel.findOne({ Email });

    if (CurrentUser?.Password !== Password) {
      return responseProvider.sendResponse({
        message: "Invalid Credentials | Password Mismatch",
        response: res,
        statusCode: 400,
      });
    }

    const token = tokenHandler.generageToken({
      Email: CurrentUser.Email,
      Name: CurrentUser.Name,
    });
    await UserModel.findOneAndUpdate(
      {
        Email,
      },
      {
        $set: { access_token: token },
      }
    );

    return responseProvider.sendResponse({
      message: "Login Successful",
      response: res,
      statusCode: 200,
      data: {
        access_token: token,
      },
    });
  } catch (err) {
    console.log(err);
    return responseProvider.InternalServerError({
      error: err as Error,
      response: res,
    });
  }
};

export default UserLoginController;
