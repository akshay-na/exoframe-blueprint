// types.ts
// Useful types for this package

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type { AxiosResponse };

export type AxiosClient = typeof axios;

export interface AxiosRequest extends AxiosRequestConfig {
  debug?: boolean;
  logRequest?: boolean;
}

export type AxiosLogger = (
  req: AxiosRequest,
  res: AxiosResponse
) => Promise<void>;
