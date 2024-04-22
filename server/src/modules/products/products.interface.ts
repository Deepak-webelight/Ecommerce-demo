export interface IproductsRouteResponse {
  message?: string;
  data?: any;
  statusCode?: number;
}
export interface IfilterQuery {
  [key: string]: string | number | { $regex: string; $options: string };
}
