import { sign, JwtPayload, verify, decode } from "jsonwebtoken";
import appConfig from "../config/appConfig";

export interface IgenerateToken {
  userId: string;
}
export const createNewToken = (
  userId: string,
  expiresIn: "1d" | "3m"
): string => {
  if (!appConfig.jwtSecret) {
    throw Error("Invalid token secret");
  }
  return sign({ userId }, appConfig.jwtSecret, {
    expiresIn,
  });
};

export const verifyToken = (token: string): IgenerateToken => {
  if (!appConfig.jwtSecret) throw Error("Invalid token secret");
  try {
    return verify(token, appConfig.jwtSecret) as IgenerateToken;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

export const decodeToken = (token: string): IgenerateToken => {
  if (!appConfig.jwtSecret) throw Error("Invalid token secret");
  try {
    return decode(token) as IgenerateToken;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
