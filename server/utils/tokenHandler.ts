import jwt from "jsonwebtoken";
import envProvider from "./envProvider";

interface IgenerageTokenInput {
  Name: string;
  Email: string;
}

interface ItokenHandler {
  generageToken: ({}: IgenerageTokenInput) => string;
}

const tokenHandler: ItokenHandler = {
  generageToken: ({ Name, Email }) => {
    if (!envProvider.TOKEN_SECRET) throw new Error("Invalid token secret");
    const token = jwt.sign({ Name, Email }, envProvider.TOKEN_SECRET, {
      expiresIn: "24h",
    });
    return token;
  },
};
export default tokenHandler;
