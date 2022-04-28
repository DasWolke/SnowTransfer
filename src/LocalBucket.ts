"use strict";

/**
 * Bucket used for saving ratelimits
 */
class LocalBucket {
	/**
	 * array of functions waiting to be executed
	 */
	public fnQueue: Array<{ fn: (...args: Array<any>) => any; callback: () => any; }> = [];
	/**
	 * Number of functions that may be executed during the timeframe set in limitReset
	 */
	public limit = 5;
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	public remaining = 1;
	/**
	 * Timeframe in milliseconds until the ratelimit resets
	 */
	public reset = 5000;
	/**
	 * Timeout that calls the reset function once the timeframe passed
	 */
	public resetTimeout: NodeJS.Timeout | null = null;
	/**
	 * ratelimiter used for ratelimiting requests
	 */
	public ratelimiter: import("./Ratelimiter");
	/**
	 * Key used internally to routify requests
	 */
	public routeKey: string;

	/**
	 * Create a new bucket
	 * @param ratelimiter ratelimiter used for ratelimiting requests
	 */
	public constructor(ratelimiter: import("./Ratelimiter"), routeKey: string) {
		this.ratelimiter = ratelimiter;
		this.routeKey = routeKey;
	}

	/**
	 * Queue a function to be executed
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public queue(fn: (bucket: LocalBucket) => any): Promise<any> {
		return new Promise(res => {
			const wrapFn = () => {
				return res(fn(this));
			};
			this.fnQueue.push({ fn, callback: wrapFn });
			this.checkQueue();
		});
	}

	public runTimer(): void {
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = setTimeout(() => this.resetRemaining(), this.ratelimiter.global ? this.ratelimiter.globalReset : this.reset);
	}

	/**
	 * Check if there are any functions in the queue that haven't been executed yet
	 */
	public checkQueue(): void {
		if (this.reset < 0) this.reset = 100;
		if (this.ratelimiter.global) return this.runTimer();
		if (this.remaining === 0) this.runTimer();
		if (this.fnQueue.length > 0 && this.remaining !== 0) {
			const queuedFunc = this.fnQueue.splice(0, 1)[0];
			this.remaining--;
			queuedFunc.callback();
			this.checkQueue();
		}
	}

	/**
	 * Reset the remaining tokens to the base limit and removes the bucket from the rate limiter to save memory
	 */
	public resetRemaining(): void {
		this.remaining = this.limit;
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = null;
		delete this.ratelimiter.buckets[this.routeKey];
	}

	/**
	 * Clear the current queue of events to be sent
	 */
	public dropQueue(): void {
		this.fnQueue.length = 0;
	}
}

export = LocalBucket;
