import { Response } from 'express';

export interface IUserResponse<T> {
  message: string;
  data?: T;
  statusCode: number;
}
export interface IUpdateUserDetailsfilter {
  name?: string;
  password?: string;
}
export interface IauthResponseCookies {
  token?: string;
  refreshToken?: string;
  res: Response;
}
