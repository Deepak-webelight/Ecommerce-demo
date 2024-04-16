import { config } from "dotenv";
config();

interface IenvProvider {
  port: string | undefined;
  mongodbUrl: string | undefined;
  jwtSecret: string | undefined;
}

const envProvider: IenvProvider = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.TOKEN_SECRET,
};

export default envProvider;