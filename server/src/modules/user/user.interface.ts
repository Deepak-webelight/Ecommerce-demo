export interface Iconfiguration {
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  TOKEN_EXPIRY: string | number;
  REFRESH_TOKEN_EXPIRY: string | number;
  AUTH_PUBLIC_KEY: string;
  X_API_KEY: string;
  IS_PUBLIC_KEY : string;
  ROLES_KEY :string
}
export interface IUserResponse {
  message: string;
  data?: any;
  status?: number;
}
