"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = require("events");
const crypto_1 = __importDefault(require("crypto"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const Endpoints_1 = __importDefault(require("./Endpoints"));
const form_data_1 = __importDefault(require("form-data"));
const package_json_1 = require("../package.json");
class RequestHandler extends events_1.EventEmitter {
    constructor(ratelimiter, options) {
        super();
        this.ratelimiter = ratelimiter;
        this.options = { baseHost: Endpoints_1.default.BASE_HOST, baseURL: Endpoints_1.default.BASE_URL };
        Object.assign(this.options, options);
        this.client = axios_1.default.create({
            baseURL: this.options.baseHost + Endpoints_1.default.BASE_URL,
            headers: {
                Authorization: options.token,
                "User-Agent": `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${package_json_1.version})`
            },
            httpAgent: new http_1.default.Agent({ keepAlive: true }),
            httpsAgent: new https_1.default.Agent({ keepAlive: true })
        });
        this.latency = 500;
        this.remaining = {};
        this.reset = {};
        this.limit = {};
    }
    request(endpoint, method, dataType = "json", data = {}) {
        if (typeof data === "number")
            data = String(data);
        const promise = new Promise(async (res, rej) => {
            this.ratelimiter.queue(async (bkt) => {
                const reqID = crypto_1.default.randomBytes(20).toString("hex");
                let latency = Date.now();
                try {
                    this.emit("request", reqID, { endpoint, method, dataType, data });
                    let request;
                    if (dataType == "json") {
                        request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")));
                    }
                    else if (dataType == "multipart") {
                        request = await this._multiPartRequest(endpoint, method, data);
                    }
                    this.latency = Date.now() - latency;
                    let offsetDate = this._getOffsetDateFromHeader(request.headers["date"]);
                    this._applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith("/reactions/:id"));
                    this.emit("done", reqID, request);
                    if (request.data) {
                        return res(request.data);
                    }
                    else {
                        return res();
                    }
                }
                catch (error) {
                    this.emit("requestError", reqID, error);
                    if (error.response) {
                        let offsetDate = this._getOffsetDateFromHeader(error.response.headers["date"]);
                        if (error.response.status === 429) {
                            this._applyRatelimitHeaders(bkt, error.response.headers, offsetDate, endpoint.endsWith("/reactions/:id"));
                            return this.request(endpoint, method, dataType, data);
                        }
                        if (error.response.status === 502) {
                            return this.request(endpoint, method, dataType, data);
                        }
                    }
                    return rej(error);
                }
            }, endpoint, method);
        });
        return promise;
    }
    _getOffsetDateFromHeader(dateHeader) {
        let discordDate = Date.parse(dateHeader);
        let offset = Date.now() - discordDate;
        return Date.now() + offset;
    }
    _applyRatelimitHeaders(bkt, headers, offsetDate, reactions = false) {
        if (headers["x-ratelimit-global"]) {
            bkt.ratelimiter.global = true;
            bkt.ratelimiter.globalReset = parseInt(headers["retry_after"]);
        }
        if (headers["x-ratelimit-reset"]) {
            let reset = (headers["x-ratelimit-reset"] * 1000) - offsetDate;
            if (reactions) {
                bkt.reset = Math.max(reset, 250);
            }
            else {
                bkt.reset = reset;
            }
        }
        if (headers["x-ratelimit-remaining"]) {
            bkt.remaining = parseInt(headers["x-ratelimit-remaining"]);
        }
        else {
            bkt.remaining = 1;
        }
        if (headers["x-ratelimit-limit"]) {
            bkt.limit = parseInt(headers["x-ratelimit-limit"]);
        }
    }
    async _request(endpoint, method, data, useParams = false) {
        let headers = {};
        if (typeof data != "string" && data.reason) {
            headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
            delete data.reason;
        }
        if (data.queryReason) {
            data.reason = data.queryReason;
            delete data.queryReason;
        }
        if (useParams) {
            return this.client({ url: endpoint, method, params: data, headers });
        }
        else {
            return this.client({ url: endpoint, method, data, headers });
        }
    }
    async _multiPartRequest(endpoint, method, data) {
        let formData = new form_data_1.default();
        if (data.file.file) {
            if (data.file.name) {
                formData.append("file", data.file.file, { filename: data.file.name });
            }
            else {
                formData.append("file", data.file.file);
            }
            delete data.file.file;
        }
        formData.append("payload_json", JSON.stringify(data));
        return this.client({
            url: endpoint,
            method,
            data: formData,
            headers: { "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}` }
        });
    }
}
module.exports = RequestHandler;
