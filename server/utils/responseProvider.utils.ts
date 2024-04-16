import { Response } from "express";

// user route Response data 
interface LoginsignupDataResponse {
  access_token: string;
}

type ServerResponseData = LoginsignupDataResponse | any; // todo

interface IsendResponse {
  response: Response;
  message: string;
  statusCode: number;
  data?: ServerResponseData;
  tokenExpire?: boolean;
}

interface IInternalServerError {
  response: Response;
  message?: string;
  error: Error;
}

interface IresponseProvider {
  sendResponse: ({}: IsendResponse) => void;
  InternalServerError: ({}: IInternalServerError) => void;
}
const responseProvider: IresponseProvider = {
  sendResponse: ({ message, response, statusCode, data }) => {
    response.status(statusCode).set("Content-Type", "application/json").send({
      message,
      statusCode,
      data,
    });
  },
  InternalServerError: ({ response, message, error }) => {
    console.log(error);

    response
      .status(500)
      .set("Content-Type", "application/json")
      .send({
        message: message || "Internal Server Error",
        statusCode: 500,
      });
  },
};

export default responseProvider;