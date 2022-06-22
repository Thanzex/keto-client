import { AxiosRequestConfig } from "axios";
import { WriteApi } from "./WriteApi";
import { ReadApi } from "./ReadApi";
import { MetadataApi } from "./MetadataApi";
import { APIRequest } from "./index.types";
export declare namespace Keto {
    interface Config {
        readUrl: string;
        writeUrl: string;
        headers?: Record<string, string>;
        axios?: AxiosRequestConfig;
    }
    class Client {
        config: Config;
        WriteApi: WriteApi;
        ReadApi: ReadApi;
        MetadataApi: MetadataApi;
        private ax;
        constructor(config: Config);
        request<D = void>({ method, path, body, params, write }: APIRequest): Promise<D>;
    }
}
//# sourceMappingURL=Client.d.ts.map