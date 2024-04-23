export interface Iconfiguration {
  port: number;
  database: string;
  jwtSecret: string;
  tokenExpiry: string | number;
  refreshTokenExpiry: string | number;
 
}
export interface IUserResponse {
  message: string;
  data?: any;
  status?: number;
}
