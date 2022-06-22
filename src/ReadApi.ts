import { AxiosError } from "axios";
import { Keto } from "./Client";
import { RelationTuple, RequestQuery, Methods, SubjectSet } from "./index.types";
import { Resource } from "./Resource";

export enum ReadPaths {
    Check = "check",
    Expand = "expand",
    Query = "relation-tuples"
}

export interface CheckRequest extends RelationTuple {
    max_depth?: number
}

export interface CheckResponse {
    allowed: boolean
}

export type QueryRequest = RequestQuery & {
    page_size?: number
    page_token?: string
}

export type QueryResponse = {
    next_page_token: string
    relation_tuples: RelationTuple[]
}

export interface ExpandResponse {
    children: any[]
    subject_set?: SubjectSet
    subject_id?: string
    type: string
}

type ExpandRequest = {
    max_depth?: number;
} & SubjectSet;

export class ReadApi extends Resource {
    constructor(parent: Keto.Client) {
        super(parent);
    }

    public async CheckPost(data: CheckRequest) {
        const { max_depth, ...body } = data
        return this.client.request<CheckResponse>({
            path: ReadPaths.Check,
            method: Methods.POST,
            body,
            params: max_depth ? { "max-depth": max_depth } : {}
        }).catch((e: AxiosError) => {
            if (e.response && e.response?.status == 403)
                return { allowed: false }
            throw e
        })
    }

    public async CheckGet(data: CheckRequest) {
        const { max_depth, ...body } = data

        const { subject_set, ...partial } = body
        let params: RequestQuery = { ...partial }
        if (subject_set)
            params = { ...params, ...Object.fromEntries(Object.entries(subject_set).map(([k, v]) => [`subject_set.${k}`, v])), }

        if (max_depth)
            params = { ...params, ...{ "max-depth": max_depth } }

        return this.client.request<CheckResponse>({
            path: ReadPaths.Check,
            method: Methods.GET,
            params: params
        }).catch((e: AxiosError) => {
            if (e.response && e.response?.status == 403)
                return { allowed: false }
            throw e
        })
    }

    public async Expand(data: ExpandRequest) {
        const { max_depth, ...body } = data
        let params: SubjectSet & { 'max-depth'?: number } = { ...body }

        if (max_depth)
            params = { ...params, ...{ "max-depth": max_depth } }

        return this.client.request<ExpandResponse>({
            path: ReadPaths.Expand,
            method: Methods.GET,
            params
        })
    }

    public async Query(data: QueryRequest) {
        return this.client.request<QueryResponse>({
            path: ReadPaths.Query,
            method: Methods.GET,
            params: data
        })
    }

}
