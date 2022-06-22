"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keto = void 0;
const axios_1 = __importDefault(require("axios"));
const WriteApi_1 = require("./WriteApi");
const ReadApi_1 = require("./ReadApi");
const MetadataApi_1 = require("./MetadataApi");
var Keto;
(function (Keto) {
    class Client {
        constructor(config) {
            this.WriteApi = new WriteApi_1.WriteApi(this);
            this.ReadApi = new ReadApi_1.ReadApi(this);
            this.MetadataApi = new MetadataApi_1.MetadataApi(this);
            this.config = config;
            this.ax = axios_1.default.create({ ...config.axios });
        }
        async request({ method, path, body, params, write = false }) {
            try {
                const { data } = await this.ax.request({
                    baseURL: write ? this.config.writeUrl : this.config.readUrl,
                    headers: { ...this.config.headers },
                    url: path,
                    method,
                    data: body,
                    params,
                    responseType: "json"
                });
                return data;
            }
            catch (error) {
                // if (axios.isAxiosError(error))
                //   throw new Error(error.message);
                // else
                throw error;
            }
        }
    }
    Keto.Client = Client;
})(Keto = exports.Keto || (exports.Keto = {}));
