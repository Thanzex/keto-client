import { Keto } from "./Client";
import { RelationTuple } from "./index.types";
import { Resource } from "./Resource";
export declare type PatchMultipleItem = {
    action: "insert" | "delete";
    relation_tuple: RelationTuple;
};
export declare type PatchMultipleRequest = PatchMultipleItem[];
export declare class WriteApi extends Resource {
    constructor(parent: Keto.Client);
    Create(data: RelationTuple): Promise<import("./index.types").SubjectSet & {
        subject_id?: string | undefined;
        subject_set?: import("./index.types").SubjectSet | undefined;
    }>;
    Delete(data: RelationTuple): Promise<null>;
    PatchMultiple(data: PatchMultipleRequest): Promise<null>;
}
//# sourceMappingURL=WriteApi.d.ts.map