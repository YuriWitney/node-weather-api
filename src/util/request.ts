import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { GenericError } from './errors/error';

export type RequestConfig = AxiosRequestConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = AxiosResponse<T>;

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: GenericError): boolean {
    return !!(error.response && error.response.status);
  }
}
