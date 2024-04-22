import { config } from "dotenv";
config();

const appConfig = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.TOKEN_SECRET,
};

export default appConfig;
