import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { WriteApi } from "./WriteApi";
import { ReadApi } from "./ReadApi";
import { MetadataApi } from "./MetadataApi";
import { APIRequest } from "./index.types";


export namespace Keto {
  export interface Config {
    readUrl: string;
    writeUrl: string;
    headers?: Record<string, string>;
    axios?: AxiosRequestConfig;
  }
  export class Client {
    config: Config;
    WriteApi: WriteApi;
    ReadApi: ReadApi;
    MetadataApi: MetadataApi;
    private ax: AxiosInstance;
    constructor(config: Config) {
      this.WriteApi = new WriteApi(this);
      this.ReadApi = new ReadApi(this);
      this.MetadataApi = new MetadataApi(this);
      this.config = config;
      this.ax = axios.create({ ...config.axios });
    }

    async request<D = void>({ method, path, body, params, write = false }: APIRequest) {
      try {
        const { data } = await this.ax.request<D>({
          baseURL: write ? this.config.writeUrl : this.config.readUrl,
          headers: { ...this.config.headers },
          url: path,
          method,
          data: body,
          params,
          responseType: "json"
        });
        return data;
      } catch (error) {
        // if (axios.isAxiosError(error))
        //   throw new Error(error.message);
        // else
        throw error;
      }
    }
  }
}
