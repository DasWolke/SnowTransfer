/// <reference types="node" />
import { EventEmitter } from "events";
declare class RequestHandler extends EventEmitter {
    ratelimiter: import("./Ratelimiter");
    options: {
        baseHost: string;
        baseURL: string;
    };
    client: import("axios").AxiosInstance;
    latency: number;
    remaining: {};
    reset: {};
    limit: {};
    constructor(ratelimiter: import("./Ratelimiter"), options: {
        token: string;
        baseHost: string;
    });
    request(endpoint: string, method: import("axios").Method, dataType?: "json" | "multipart", data?: any | undefined): Promise<any>;
    private _getOffsetDateFromHeader;
    private _applyRatelimitHeaders;
    private _request;
    private _multiPartRequest;
}
export = RequestHandler;
