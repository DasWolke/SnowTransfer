"use strict";
class LocalBucket {
    constructor(ratelimiter) {
        this.fnQueue = [];
        this.limit = 5;
        this.remaining = 1;
        this.reset = 5000;
        this.resetTimeout = null;
        this.ratelimiter = ratelimiter;
    }
    queue(fn) {
        return new Promise((res, rej) => {
            let bkt = this;
            let wrapFn = () => {
                if (typeof fn.then === "function") {
                    return fn(bkt).then(res).catch(rej);
                }
                return res(fn(bkt));
            };
            this.fnQueue.push({
                fn, callback: wrapFn
            });
            this.checkQueue();
        });
    }
    checkQueue() {
        if (this.reset < 0) {
            this.reset = 100;
        }
        if (this.ratelimiter.global) {
            this.resetTimeout = setTimeout(() => this.resetRemaining(), this.ratelimiter.globalReset);
            return;
        }
        if (this.remaining === 0) {
            if (!this.resetTimeout) {
                this.resetTimeout = setTimeout(() => this.resetRemaining(), this.reset);
            }
        }
        if (this.fnQueue.length > 0 && this.remaining !== 0) {
            let queuedFunc = this.fnQueue.splice(0, 1)[0];
            queuedFunc.callback();
            this.checkQueue();
        }
    }
    resetRemaining() {
        this.remaining = this.limit;
        clearTimeout(this.resetTimeout);
        this.resetTimeout = null;
        this.checkQueue();
    }
    dropQueue() {
        this.fnQueue = [];
    }
}
module.exports = LocalBucket;
