import { sign, JwtPayload, verify } from "jsonwebtoken";
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

export const verifyToken = (token: string): JwtPayload | string => {
  if (!appConfig.jwtSecret) throw Error("Invalid token secret");
  try {
    return verify(token, appConfig.jwtSecret);
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
