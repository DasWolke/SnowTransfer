"use strict";
class DewCache extends Map {
    constructor() {
        super();
    }
    async wrap(key, promise) {
        const data = await promise;
        this.set(key, data);
        return data;
    }
    async fetch(key, fallback) {
        if (this.has(key)) {
            return Promise.resolve(this.get(key));
        }
        else {
            return fallback(key);
        }
    }
}
module.exports = DewCache;
