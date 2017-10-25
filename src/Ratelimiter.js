const LocalBucket = require('./ratelimitBuckets/LocalBucket');

class Ratelimiter {
    constructor() {
        this.buckets = {};
        this.global = false;
        this.globalReset = 0;
    }

    /**
     * Returns a key for saving ratelimits for routes
     * (Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js) -> I luv u abal <3
     * @param url - url to reduce to a key something like /channels/266277541646434305/messages/266277541646434305/
     * @param method - method of the request, usual http methods like get, etc.
     * @returns {string}
     */
    routify(url, method) {
        let route = url.replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, function (match, p) {
            return p === 'channels' || p === 'guilds' || p === 'webhooks' ? match : `/${p}/:id`;
        }).replace(/\/reactions\/[^/]+/g, '/reactions/:id').replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, '/webhooks/$1/:token');
        if (method.toUpperCase() === 'DELETE' && route.endsWith('/messages/:id')) { // Delete Messsage endpoint has its own ratelimit
            route = method + route;
        }
        return route;
    }

    queue(fn, url, method) {
        let routeKey = this.routify(url, method);
        if (!this.buckets[routeKey]) {
            this.buckets[routeKey] = new LocalBucket(this);
        }
        this.buckets[routeKey].queue(fn);
    }
}

module.exports = Ratelimiter;