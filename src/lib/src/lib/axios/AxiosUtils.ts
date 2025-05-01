// AxiosUtils.ts
// Utilities that are usefule for this package

import dateformat from "dateformat";

import axios from "axios";

import { AxiosClient } from "./types";
export type { AxiosClient };

import { AxiosRequest, AxiosResponse } from "./types";
export type { AxiosRequest, AxiosResponse };

import { AxiosLogger } from "./types";
export type { AxiosLogger };

export class AxiosUtils {
  public static async initialiseClient(): Promise<AxiosClient> {
    return axios;
  }

  public static get CONSOLE_LOGGER(): AxiosLogger {
    return async (req, res) => {
      const ts = dateformat(new Date(), "UTC:yyyymmddHHMMss-l");
      console.log(`[${ts}]: `, {
        request: {
          url: req.url,
          headers: req.headers,
          data: req.data,
        },
        response: {
          status: res.status,
          statusText: res.statusText,
          config: res.config,
          data: res.data,
        },
      });
    };
  }
}
