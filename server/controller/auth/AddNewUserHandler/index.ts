import { Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import { IsignupRequestbody } from "../../../routes/auth";
import UserModel from "../../../model/userModel";

const AddNewUserHandler = async (req: Request, res: Response) => {
  try {
    const { Name, Email, Password }: IsignupRequestbody = req.body;

    const newUser = new UserModel({
      Name,
      Email,
      Password,
    });
    newUser.save();

    console.log(newUser);

    responseProvider.sendResponse({
      message: "User Created Successfully",
      response: res,
      statusCode: 200,
    });
  } catch (err) {
    return responseProvider.InternalServerError({ response: res });
  }
};

export default AddNewUserHandler;
