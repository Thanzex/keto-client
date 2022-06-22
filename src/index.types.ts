import { } from 'axios'
import { PatchMultipleRequest } from './WriteApi'

export enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    INFO = "INFO",
    DELETE = "DELETE",
}

export interface APIRequest {
    method: Methods
    path: string
    body?: RelationTuple | PatchMultipleRequest
    params?: Record<string, string | number | null>
    write?: boolean
}

export type RequestQuery = Omit<Partial<RelationTuple> & Pick<RelationTuple, "namespace">, "subject_set"> & {
    [K in keyof SubjectSet as `subject_set.${K}`]?: SubjectSet[K]
}

export interface GenericError {
    code: number
    details: Record<string, any>[]
    message: string
    reason: string
    request: string
    status: string
}

type BaseRelationTuple = SubjectSet & {
    subject_id?: string
    subject_set?: SubjectSet
}

export type RelationTuple = BaseRelationTuple


export type SubjectSet = {
    namespace: string
    object: string
    relation: string
}
