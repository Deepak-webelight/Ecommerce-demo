import jwt from "jsonwebtoken";
import envProvider from "./envProvider.utils";

export interface IgenerageTokenInput {
  userId: string;
}

interface ItokenHandler {
  generageToken: (data: IgenerageTokenInput) => string;
  verifyToken: (token: string) => jwt.JwtPayload | string;
}

const tokenHandler: ItokenHandler = {
  generageToken: ({ userId }) => {
    if (!envProvider.jwtSecret) throw Error("Invalid token secret");
    const token = jwt.sign({ userId }, envProvider.jwtSecret, {
      expiresIn: "24h",
    });
    return token;
  },
  verifyToken: async (token) => {
    if (!envProvider.jwtSecret) throw Error("Invalid token secret");

    try {
      return await jwt.verify(token, envProvider.jwtSecret);
    } catch (err) {
      return false;
    }
  },
};
export default tokenHandler;
