import LocalBucket from "./ratelimitBuckets/LocalBucket";
/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @protected
 */
declare class Ratelimiter {
    buckets: {
        [key: string]: LocalBucket;
    };
    global: boolean;
    globalReset: number;
    /**
     * @constructor
     * @protected
     */
    constructor();
    /**
     * Returns a key for saving ratelimits for routes
     * (Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js) -> I luv u abal <3
     * @param {String} url - url to reduce to a key something like /channels/266277541646434305/messages/266277541646434305/
     * @param {String} method - method of the request, usual http methods like get, etc.
     * @returns {String} - reduced url: /channels/266277541646434305/messages/:id/
     * @protected
     */
    routify(url: string, method: string): string;
    /**
     * Queue a rest call to be executed
     * @param {Function} fn - function to call once the ratelimit is ready
     * @param {String} url - Endpoint of the request
     * @param {String} method - Http method used by the request
     * @protected
     */
    queue(fn: Function, url: string, method: string): void;
}
export default Ratelimiter;
//# sourceMappingURL=Ratelimiter.d.ts.map