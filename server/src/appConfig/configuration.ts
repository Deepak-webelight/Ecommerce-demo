export interface Iconfiguration {
  port: number;
  database: string;
  jwtSecret: string;
  tokenExpiry: string | number;
  refreshTokenExpiry: string | number;
}
export default (): Iconfiguration => ({
  port: parseInt(process.env.PORT) || 5000,
  database: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiry: process.env.TOKEN_EXPIRY,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
});
