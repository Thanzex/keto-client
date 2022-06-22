"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadApi = exports.ReadPaths = void 0;
const index_types_1 = require("./index.types");
const Resource_1 = require("./Resource");
var ReadPaths;
(function (ReadPaths) {
    ReadPaths["Check"] = "check";
    ReadPaths["Expand"] = "expand";
    ReadPaths["Query"] = "relation-tuples";
})(ReadPaths = exports.ReadPaths || (exports.ReadPaths = {}));
class ReadApi extends Resource_1.Resource {
    constructor(parent) {
        super(parent);
    }
    async CheckPost(data) {
        const { max_depth, ...body } = data;
        return this.client.request({
            path: ReadPaths.Check,
            method: index_types_1.Methods.POST,
            body,
            params: max_depth ? { "max-depth": max_depth } : {}
        }).catch((e) => {
            if (e.response && e.response?.status == 403)
                return { allowed: false };
            throw e;
        });
    }
    async CheckGet(data) {
        const { max_depth, ...body } = data;
        const { subject_set, ...partial } = body;
        let params = { ...partial };
        if (subject_set)
            params = { ...params, ...Object.fromEntries(Object.entries(subject_set).map(([k, v]) => [`subject_set.${k}`, v])), };
        if (max_depth)
            params = { ...params, ...{ "max-depth": max_depth } };
        return this.client.request({
            path: ReadPaths.Check,
            method: index_types_1.Methods.GET,
            params: params
        }).catch((e) => {
            if (e.response && e.response?.status == 403)
                return { allowed: false };
            throw e;
        });
    }
    async Expand(data) {
        const { max_depth, ...body } = data;
        let params = { ...body };
        if (max_depth)
            params = { ...params, ...{ "max-depth": max_depth } };
        return this.client.request({
            path: ReadPaths.Expand,
            method: index_types_1.Methods.GET,
            params
        });
    }
    async Query(data) {
        return this.client.request({
            path: ReadPaths.Query,
            method: index_types_1.Methods.GET,
            params: data
        });
    }
}
exports.ReadApi = ReadApi;
