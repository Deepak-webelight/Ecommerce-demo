import { config } from "dotenv";
config();

interface IappConfig {
  port: string | undefined;
  mongodbUrl: string | undefined;
  jwtSecret: string | undefined;
}

const appConfig: IappConfig = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.TOKEN_SECRET,
};

export default appConfig;