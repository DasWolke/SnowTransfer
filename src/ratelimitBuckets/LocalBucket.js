'use strict';

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
                if (typeof fn.then === 'function') {
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
        if (this.ratelimiter.global) {
            this.resetTimeout = setTimeout(() => this.resetRemaining(), this.ratelimiter.globalReset);
            return;
        }
        if (this.remaining === 0) {
            this.resetTimeout = setTimeout(() => this.resetRemaining(), this.reset);
            return;
        }
        if (this.fnQueue.length > 0 && this.remaining !== 0) {
            let queuedFunc = this.fnQueue.splice(0, 1)[0];
            queuedFunc.callback();
        }
    }

    resetRemaining() {
        this.remaining = this.limit;
        clearTimeout(this.resetTimeout);
        this.checkQueue();
    }

    dropQueue() {
        this.fnQueue = [];
    }
}

module.exports = LocalBucket;
