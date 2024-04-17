import { Response } from "express";

// user route Response data
interface LoginsignupDataResponse {
  access_token: string;
}

type ServerResponseData = LoginsignupDataResponse | any; // todo

interface ICookieOptions {
  domain?: string;
  path?: string;
  expires?: Date | undefined;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

interface IsendResponse {
  response: Response<any, Record<string, any>>;
  message: string;
  statusCode: number;
  data?: ServerResponseData;
  tokenExpire?: boolean;
  headers?: {
    [key: string]: string | number | boolean;
  };
  cookie?: {
    name: string;
    value: string;
    cookieOptions: ICookieOptions;
  }[];
}

interface IInternalServerError {
  response: Response;
  message?: string;
  error: Error;
}
interface IClearCookie {
  name: string;
  response: Response;
}

interface IresponseProvider {
  sendResponse: (data: IsendResponse) => void;
  InternalServerError: (data: IInternalServerError) => void;
  clearCookies: (data: IClearCookie) => void;
}
const responseProvider: IresponseProvider = {
  sendResponse: ({
    message,
    response,
    statusCode,
    data,
    cookie,
    headers,
    tokenExpire,
  }) => {
    const resHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (cookie?.length) {
      cookie.forEach((reqCookie) =>
        response.cookie(
          reqCookie.name,
          reqCookie.value,
          reqCookie.cookieOptions
        )
      );
    }

    response.status(statusCode).set(resHeaders).send({
      message,
      statusCode,
      data,
      tokenExpire,
    });
  },
  InternalServerError: ({ response, message, error }) => {
    console.log("Internal Server Error", error);
    response
      .status(500)
      .set("Content-Type", "application/json")
      .send({
        message: message || "Internal Server Error",
        statusCode: 500,
      });
  },
  clearCookies: ({ name, response }) => {
    response.clearCookie(name, { expires: new Date(0) });
  },
};

export default responseProvider;
