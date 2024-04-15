import { NextFunction, Request, Response } from "express";
import responseProvider from "../../../utils/responseProvider";
import tokenHandler from "../../../utils/tokenHandler";

const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return responseProvider.sendResponse({
        message: "Bad Request | Authorization header is missing",
        response: res,
        statusCode: 400,
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return responseProvider.sendResponse({
        message: "Bad Request | Invalid Token",
        response: res,
        statusCode: 400,
      });
    }

    console.log("Token:", token);

    const isValidToken = await tokenHandler.verifyToken(token);

    if (isValidToken) {
      next();
    } else {
      return responseProvider.sendResponse({
        message: "Bad Request | Token is invalid or expired",
        response: res,
        statusCode: 400,
        tokenExpire: !!isValidToken
      });
    }
  } catch (err) {
    console.error("Error in verifyAuthToken:", err);
    return responseProvider.InternalServerError({
      error: err as Error,
      response: res,
    });
  }
};

export default verifyAuthToken;
