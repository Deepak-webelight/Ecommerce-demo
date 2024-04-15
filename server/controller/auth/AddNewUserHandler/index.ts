import { Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import { IsignupRequestbody } from "../../../routes/auth";
import UserModel from "../../../model/userModel";
import tokenHandler from "../../../utils/tokenHandler";

const AddNewUserHandler = async (req: Request, res: Response) => {
  try {
    const { Name, Email, Password }: IsignupRequestbody = req.body;
    
    const token = tokenHandler.generageToken({ Email, Name });

    const newUser = new UserModel({
      Name,
      Email,
      Password,
      access_token : token
    });
    newUser.save();


    responseProvider.sendResponse({
      message: "User Created Successfully",
      response: res,
      statusCode: 200,
      data: {
        access_token: token,
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
