'use strict';

/**
 * Bucket used for saving ratelimits
 * @property {Array} fnQueue - array of functions waiting to be executed
 * @property {Number} limit - Number of functions that may be executed during the timeframe set in limitReset
 * @property {Number} remaining - Remaining amount of executions during the current timeframe
 * @property {Number} limitReset - Timeframe in milliseconds until the ratelimit resets
 * @property {Object} resetTimeout - Timeout that calls the reset function once the timeframe passed
 * @property {Ratelimiter} ratelimiter - ratelimiter used for ratelimiting requests
 * @protected
 */
class LocalBucket {
    /**
     * Create a new bucket
     * @param {Ratelimiter} ratelimiter - ratelimiter used for ratelimiting requests
     * @protected
     */
    constructor(ratelimiter) {
        this.fnQueue = [];
        this.limit = 5;
        this.remaining = 1;
        this.reset = 5000;
        this.resetTimeout = null;
        this.ratelimiter = ratelimiter;
    }

    /**
     * Queue a function to be executed
     * @param {Function} fn - function to be executed
     * @returns {Promise.<void>} - Result of the function if any
     * @protected
     */
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

    /**
     * Check if there are any functions in the queue that haven't been executed yet
     * @protected
     */
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

    /**
     * Reset the remaining tokens to the base limit
     * @protected
     */
    resetRemaining() {
        this.remaining = this.limit;
        clearTimeout(this.resetTimeout);
        this.resetTimeout = null;
        this.checkQueue();
    }

    /**
     * Clear the current queue of events to be sent
     * @protected
     */
    dropQueue() {
        this.fnQueue = [];
    }
}

module.exports = LocalBucket;
