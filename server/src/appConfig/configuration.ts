import { config } from 'dotenv';
import { CookieOptions } from 'express';
config();

export const appConfig = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminApiKey: process.env.ADMIN_API_KEY,
};

export const cookieConfiguration: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
};

