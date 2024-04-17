import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig";

export interface IgenerageTokenInput {
  userId: string;
  expiresIn: "2h" | "3m";
}

export const generageToken = ({
  userId,
  expiresIn,
}: IgenerageTokenInput): string => {
  if (!appConfig.jwtSecret) throw Error("Invalid token secret");
  const token = jwt.sign({ userId }, appConfig.jwtSecret, {
    expiresIn,
  });
  return token;
};

export const verifyToken = (
  token: string
): jwt.JwtPayload | string | boolean => {
  if (!appConfig.jwtSecret) throw Error("Invalid token secret");
  try {
    return jwt.verify(token, appConfig.jwtSecret);
  } catch (err) {
    return false;
  }
};
