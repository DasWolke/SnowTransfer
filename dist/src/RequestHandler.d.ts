/// <reference types="node" />
import { EventEmitter } from "events";
declare type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";
declare class RequestHandler extends EventEmitter {
    ratelimiter: import("./Ratelimiter");
    options: {
        baseHost: string;
        baseURL: string;
        headers: {
            Authorization: string;
            "User-Agent": string;
        };
    };
    latency: number;
    remaining: {};
    reset: {};
    limit: {};
    apiURL: string;
    constructor(ratelimiter: import("./Ratelimiter"), options: {
        token: string;
        baseHost: string;
    });
    request(endpoint: string, method: HTTPMethod, dataType?: "json" | "multipart", data?: any | undefined): Promise<any>;
    private _getOffsetDateFromHeader;
    private _applyRatelimitHeaders;
    private _request;
    private _multiPartRequest;
}
export = RequestHandler;
