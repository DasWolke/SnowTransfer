"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const LocalBucket_1 = __importDefault(require("./ratelimitBuckets/LocalBucket"));
class Ratelimiter {
    constructor() {
        this.buckets = {};
        this.global = false;
        this.globalReset = 0;
    }
    routify(url, method) {
        let route = url.replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, function (match, p) {
            return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
        }).replace(/\/reactions\/[^/]+/g, "/reactions/:id").replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:token");
        if (method.toUpperCase() === "DELETE" && route.endsWith("/messages/:id")) {
            route = method + route;
        }
        return route;
    }
    queue(fn, url, method) {
        const routeKey = this.routify(url, method);
        if (!this.buckets[routeKey]) {
            this.buckets[routeKey] = new LocalBucket_1.default(this);
        }
        this.buckets[routeKey].queue(fn);
    }
}
module.exports = Ratelimiter;
