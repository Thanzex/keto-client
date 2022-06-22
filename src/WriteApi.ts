import { Keto } from "./Client";
import { RelationTuple, RequestQuery, Methods } from "./index.types";
import { Resource } from "./Resource";

const path = "relation-tuples"

export type PatchMultipleItem = {
    action: "insert" | "delete"
    relation_tuple: RelationTuple
}

export type PatchMultipleRequest = PatchMultipleItem[]


export class WriteApi extends Resource {
    constructor(parent: Keto.Client) {
        super(parent);
    }

    public async Create(data: RelationTuple) {
        return this.client.request<RelationTuple>({
            path,
            method: Methods.PUT,
            body: data,
            write: true
        })
    }

    public async Delete(data: RelationTuple) {
        const {subject_set, ...partial} = data
        let params: RequestQuery = {...partial}

        if (subject_set)
            params = {...params, ...Object.fromEntries(Object.entries(subject_set).map(([k, v]) => [`subject_set.${k}`, v])),  } 

        return this.client.request<null>({
            path,
            method: Methods.DELETE,
            params,
            write: true
        })
    }

    public async PatchMultiple(data: PatchMultipleRequest) {
        return this.client.request<null>({
            path,
            method: Methods.PATCH,
            body: data,
            write: true
        })
    }
}
