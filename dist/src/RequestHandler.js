"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = require("events");
const crypto_1 = __importDefault(require("crypto"));
const centra_1 = __importDefault(require("centra"));
const Endpoints_1 = __importDefault(require("./Endpoints"));
const form_data_1 = __importDefault(require("form-data"));
const package_json_1 = require("../package.json");
class RequestHandler extends events_1.EventEmitter {
    constructor(ratelimiter, options) {
        super();
        this.ratelimiter = ratelimiter;
        this.options = {
            baseHost: Endpoints_1.default.BASE_HOST,
            baseURL: Endpoints_1.default.BASE_URL,
            headers: {
                Authorization: options.token,
                "User-Agent": `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${package_json_1.version})`
            }
        };
        Object.assign(this.options, options);
        this.apiURL = this.options.baseHost + Endpoints_1.default.BASE_URL;
        this.latency = 500;
        this.remaining = {};
        this.reset = {};
        this.limit = {};
    }
    request(endpoint, method, dataType = "json", data = {}) {
        if (typeof data === "number")
            data = String(data);
        return new Promise(async (res, rej) => {
            this.ratelimiter.queue(async (bkt) => {
                const reqID = crypto_1.default.randomBytes(20).toString("hex");
                const latency = Date.now();
                try {
                    this.emit("request", reqID, { endpoint, method, dataType, data });
                    let request;
                    if (dataType == "json") {
                        request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")));
                    }
                    else if (dataType == "multipart") {
                        request = await this._multiPartRequest(endpoint, method, data);
                    }
                    else {
                        throw new Error("Forbidden dataType. Use json or multipart");
                    }
                    this.latency = Date.now() - latency;
                    const offsetDate = this._getOffsetDateFromHeader(request.headers["date"]);
                    this._applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith("/reactions/:id"));
                    this.emit("done", reqID, request);
                    if (request.body) {
                        let b;
                        try {
                            b = JSON.parse(request.body.toString());
                        }
                        catch {
                            res();
                        }
                        return res(b);
                    }
                    else {
                        return res();
                    }
                }
                catch (error) {
                    this.emit("requestError", reqID, error);
                    if (error.response) {
                        const offsetDate = this._getOffsetDateFromHeader(error.response.headers["date"]);
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
    }
    _getOffsetDateFromHeader(dateHeader) {
        const discordDate = Date.parse(dateHeader);
        const offset = Date.now() - discordDate;
        return Date.now() + offset;
    }
    _applyRatelimitHeaders(bkt, headers, offsetDate, reactions = false) {
        if (headers["x-ratelimit-global"]) {
            bkt.ratelimiter.global = true;
            bkt.ratelimiter.globalReset = parseInt(headers["retry_after"]);
        }
        if (headers["x-ratelimit-reset"]) {
            const reset = (headers["x-ratelimit-reset"] * 1000) - offsetDate;
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
        const headers = {};
        if (typeof data != "string" && data.reason) {
            headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
            delete data.reason;
        }
        if (data.queryReason) {
            data.reason = data.queryReason;
            delete data.queryReason;
        }
        const req = centra_1.default(this.apiURL, method).path(endpoint).header(this.options.headers);
        if (useParams) {
            return req.query(data).send();
        }
        else {
            if (data && typeof data === "object")
                req.body(data, "json");
            else if (data)
                req.body(data);
            return req.send();
        }
    }
    async _multiPartRequest(endpoint, method, data) {
        const formData = new form_data_1.default();
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
        const newHeaders = Object.assign(Object.create(null), this.options.headers);
        Object.assign(newHeaders, { "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}` });
        return centra_1.default(this.apiURL, method).path(endpoint).header(newHeaders).body(formData, "form").send();
    }
}
module.exports = RequestHandler;
