"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteApi = void 0;
const index_types_1 = require("./index.types");
const Resource_1 = require("./Resource");
const path = "relation-tuples";
class WriteApi extends Resource_1.Resource {
    constructor(parent) {
        super(parent);
    }
    async Create(data) {
        return this.client.request({
            path,
            method: index_types_1.Methods.PUT,
            body: data,
            write: true
        });
    }
    async Delete(data) {
        const { subject_set, ...partial } = data;
        let params = { ...partial };
        if (subject_set)
            params = { ...params, ...Object.fromEntries(Object.entries(subject_set).map(([k, v]) => [`subject_set.${k}`, v])), };
        return this.client.request({
            path,
            method: index_types_1.Methods.DELETE,
            params,
            write: true
        });
    }
    async PatchMultiple(data) {
        return this.client.request({
            path,
            method: index_types_1.Methods.PATCH,
            body: data,
            write: true
        });
    }
}
exports.WriteApi = WriteApi;
