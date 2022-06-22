import { Keto } from "./Client";
import { Methods } from "./index.types";
import { Resource } from "./Resource";

export enum MetadataPaths {
    ServerStatus = "health/alive",
    ServerAndDatabaseStatus = "health/ready",
    Version = "version",
}


export class MetadataApi extends Resource {
    constructor(parent: Keto.Client) {
        super(parent);
    }

    public async GetServerStatus() {
        return this.client.request<{ status: string }>({
            method: Methods.GET,
            path: MetadataPaths.ServerStatus,
        })
    }

    public async GetServerAndDatabaseStatus() {
        return this.client.request<{ status: string }>({
            method: Methods.GET,
            path: MetadataPaths.ServerAndDatabaseStatus,
        })
    }

    public async GetVersion() {
        return this.client.request<{ version: string }>({
            method: Methods.GET,
            path: MetadataPaths.Version,
        })
    }
}
