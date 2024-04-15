import { Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import tokenHandler, { IgenerageTokenInput } from "../../../utils/tokenHandler";
import UserModel from "../../../model/userModel";

const UserRefreshTokenController = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;

    const token = (authorization as string)?.split(" ")[1];

    const tokenData = (await tokenHandler.verifyToken(
      token
    )) as IgenerageTokenInput;
    console.log(tokenData);

    const newToken = await tokenHandler.generageToken({
      Name: tokenData.Name,
      Email: tokenData.Email,
    });

    await UserModel.findOneAndUpdate(
      {
        Email: tokenData.Email,
      },
      {
        $set: { access_token: newToken },
      }
    );

    return responseProvider.sendResponse({
      message: "token refreshed",
      response: res,
      statusCode: 200,
      data: {
        access_token: newToken,
      },
    });
  } catch (err) {
    console.error("Error in UserRefreshTokenController:", err);
    return responseProvider.InternalServerError({
      error: err as Error,
      response: res,
    });
  }
};

export default UserRefreshTokenController;
