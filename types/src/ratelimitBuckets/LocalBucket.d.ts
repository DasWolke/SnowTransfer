/// <reference types="node" />
import Ratelimiter from "../Ratelimiter";
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
declare class LocalBucket {
    fnQueue: Array<{
        fn: Function | Promise<Function>;
        callback: Function;
    }>;
    limit: number;
    remaining: number;
    reset: number;
    ratelimiter: Ratelimiter;
    resetTimeout: NodeJS.Timeout | null;
    /**
     * Create a new bucket
     * @param {Ratelimiter} ratelimiter - ratelimiter used for ratelimiting requests
     * @protected
     */
    constructor(ratelimiter: Ratelimiter);
    /**
     * Queue a function to be executed
     * @param {Function} fn - function to be executed
     * @returns {Promise.<void>} - Result of the function if any
     * @protected
     */
    queue(fn: Function | Promise<Function>): Promise<this>;
    /**
     * Check if there are any functions in the queue that haven't been executed yet
     * @protected
     */
    checkQueue(): void;
    /**
     * Reset the remaining tokens to the base limit
     * @protected
     */
    resetRemaining(): void;
    /**
     * Clear the current queue of events to be sent
     * @protected
     */
    dropQueue(): void;
}
export default LocalBucket;
//# sourceMappingURL=LocalBucket.d.ts.map