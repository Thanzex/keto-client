import { Keto } from "./Client";
import { RelationTuple, RequestQuery, SubjectSet } from "./index.types";
import { Resource } from "./Resource";
export declare enum ReadPaths {
    Check = "check",
    Expand = "expand",
    Query = "relation-tuples"
}
export interface CheckRequest extends RelationTuple {
    max_depth?: number;
}
export interface CheckResponse {
    allowed: boolean;
}
export declare type QueryRequest = RequestQuery & {
    page_size?: number;
    page_token?: string;
};
export declare type QueryResponse = {
    next_page_token: string;
    relation_tuples: RelationTuple[];
};
export interface ExpandResponse {
    children: any[];
    subject_set?: SubjectSet;
    subject_id?: string;
    type: string;
}
declare type ExpandRequest = {
    max_depth?: number;
} & SubjectSet;
export declare class ReadApi extends Resource {
    constructor(parent: Keto.Client);
    CheckPost(data: CheckRequest): Promise<CheckResponse | {
        allowed: boolean;
    }>;
    CheckGet(data: CheckRequest): Promise<CheckResponse | {
        allowed: boolean;
    }>;
    Expand(data: ExpandRequest): Promise<ExpandResponse>;
    Query(data: QueryRequest): Promise<QueryResponse>;
}
export {};
//# sourceMappingURL=ReadApi.d.ts.map