import { Keto } from "./Client";
import { Resource } from "./Resource";
export declare enum MetadataPaths {
    ServerStatus = "health/alive",
    ServerAndDatabaseStatus = "health/ready",
    Version = "version"
}
export declare class MetadataApi extends Resource {
    constructor(parent: Keto.Client);
    GetServerStatus(): Promise<{
        status: string;
    }>;
    GetServerAndDatabaseStatus(): Promise<{
        status: string;
    }>;
    GetVersion(): Promise<{
        version: string;
    }>;
}
//# sourceMappingURL=MetadataApi.d.ts.map