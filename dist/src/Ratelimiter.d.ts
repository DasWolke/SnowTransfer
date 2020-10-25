import LocalBucket from "./ratelimitBuckets/LocalBucket";
declare class Ratelimiter {
    buckets: {
        [routeKey: string]: LocalBucket;
    };
    global: boolean;
    globalReset: number;
    constructor();
    protected routify(url: string, method: string): string;
    queue(fn: (...args: Array<any>) => any, url: string, method: string): void;
}
export = Ratelimiter;
