import { Response } from "express";

type ServerResponseData = any; // todo

interface IsendResponse {
  response: Response;
  message: string;
  statusCode: number;
  data?: ServerResponseData;
}

interface IInternalServerError {
  response: Response;
  message?: string;
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
  InternalServerError: ({ response, message }) => {
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
