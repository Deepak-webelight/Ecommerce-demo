import { config } from "dotenv";
config();

interface IenvProvider {
  PORT: string | undefined;
  MONGODB_URL: string | undefined;
}

const envProvider: IenvProvider = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
};

export default envProvider;
