import { Iconfiguration } from "src/modules/user/user.interface";

export default (): Iconfiguration => ({
  port: parseInt(process.env.PORT) || 5000,
  database: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiry: process.env.TOKEN_EXPIRY,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
});
