import { Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import UserModel from "../../../model/userModel";

const UserLogoutController = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;

    const token = (authorization as string)?.split(" ")[1];

    await UserModel.findOneAndUpdate(
      { access_token: token },
      { access_token: null }
    );

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
};

export default UserLogoutController;
