import jwt from "jsonwebtoken";
import envProvider from "./envProvider";

export interface IgenerageTokenInput {
  Name: string;
  Email: string;
}

interface ItokenHandler {
  generageToken: ({}: IgenerageTokenInput) => string;
  verifyToken: (token: string) => jwt.JwtPayload | string;
}

const tokenHandler: ItokenHandler = {
  generageToken: ({ Name, Email }) => {
    if (!envProvider.TOKEN_SECRET) throw new Error("Invalid token secret");
    const token = jwt.sign({ Name, Email }, envProvider.TOKEN_SECRET, {
      expiresIn: "24h",
    });
    return token;
  },
  verifyToken: async (token) => {
    if (!envProvider.TOKEN_SECRET) throw new Error("Invalid token secret");

    try {
      return await jwt.verify(token, envProvider.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  },
};
export default tokenHandler;
