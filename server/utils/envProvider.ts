import { config } from "dotenv";
config();

interface IenvProvider {
  PORT: string | undefined;
  MONGODB_URL: string | undefined;
  TOKEN_SECRET: string | undefined;
}

const envProvider: IenvProvider = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
};

export default envProvider;
