import { Request, Response } from "express";
import { IsignupRequestbody } from "../routes/user.routes";
import tokenHandler from "../utils/tokenHandler.utils";
import userModel from "../models/user.model";
import responseProvider from "../utils/responseProvider.utils";
// import responseProvider from "../../../utils/responseProvider";
// import { IsignupRequestbody } from "../../../routes/auth";
// import UserModel from "../../../model/userModel";
// import tokenHandler from "../../../utils/tokenHandler";

const AddNewUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, name, password }: IsignupRequestbody = req.body;

    // const newUser = new userModel({
    //   Name,
    //   Email,
    //   Password,

    // });

    // const token = tokenHandler.generageToken({ userId });

    // newUser.save();

    responseProvider.sendResponse({
      message: "User Created Successfully",
      response: res,
      statusCode: 200,
      data: {
        access_token: "token",
      },
    });
  } catch (err) {
    return responseProvider.InternalServerError({
      response: res,
      error: err as Error,
    });
  }
};

export default AddNewUserHandler;
