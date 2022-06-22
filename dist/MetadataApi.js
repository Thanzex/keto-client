"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataApi = exports.MetadataPaths = void 0;
const index_types_1 = require("./index.types");
const Resource_1 = require("./Resource");
var MetadataPaths;
(function (MetadataPaths) {
    MetadataPaths["ServerStatus"] = "health/alive";
    MetadataPaths["ServerAndDatabaseStatus"] = "health/ready";
    MetadataPaths["Version"] = "version";
})(MetadataPaths = exports.MetadataPaths || (exports.MetadataPaths = {}));
class MetadataApi extends Resource_1.Resource {
    constructor(parent) {
        super(parent);
    }
    async GetServerStatus() {
        return this.client.request({
            method: index_types_1.Methods.GET,
            path: MetadataPaths.ServerStatus,
        });
    }
    async GetServerAndDatabaseStatus() {
        return this.client.request({
            method: index_types_1.Methods.GET,
            path: MetadataPaths.ServerAndDatabaseStatus,
        });
    }
    async GetVersion() {
        return this.client.request({
            method: index_types_1.Methods.GET,
            path: MetadataPaths.Version,
        });
    }
}
exports.MetadataApi = MetadataApi;
