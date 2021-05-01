"use strict";

/**
 * Bucket used for saving ratelimits
 */
class LocalBucket {
	/**
	 * array of functions waiting to be executed
	 */
	public fnQueue: Array<{ fn: (...args: Array<any>) => any; callback: () => any }>;
	/**
	 * Number of functions that may be executed during the timeframe set in limitReset
	 */
	public limit: number;
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	public remaining: number;
	/**
	 * Timeframe in milliseconds until the ratelimit resets
	 */
	public reset: number;
	/**
	 * Timeout that calls the reset function once the timeframe passed
	 */
	public resetTimeout: NodeJS.Timeout | null;
	/**
	 * ratelimiter used for ratelimiting requests
	 */
	public ratelimiter: import("../Ratelimiter");

	/**
	 * Create a new bucket
	 * @param ratelimiter ratelimiter used for ratelimiting requests
	 */
	public constructor(ratelimiter: import("../Ratelimiter")) {
		this.fnQueue = [];
		this.limit = 5;
		this.remaining = 1;
		this.reset = 5000;
		this.resetTimeout = null;
		this.ratelimiter = ratelimiter;
	}

	/**
	 * Queue a function to be executed
	 * @param {(...args: any[]) => any} fn - function to be executed
	 * @returns Result of the function if any
	 */
	public queue(fn: (...args: Array<any>) => any): Promise<any> {
		return new Promise((res, rej) => {
			const wrapFn = () => {
				// @ts-ignore I am confused behind this logic but okay.
				if (typeof fn.then === "function") {
					return fn(this).then(res).catch(rej);
				}
				return res(fn(this));
			};
			this.fnQueue.push({
				fn, callback: wrapFn
			});
			this.checkQueue();
		});
	}

	/**
	 * Check if there are any functions in the queue that haven't been executed yet
	 */
	protected checkQueue() {
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
			const queuedFunc = this.fnQueue.splice(0, 1)[0];
			queuedFunc.callback();
			this.checkQueue();
		}
	}

	/**
	 * Reset the remaining tokens to the base limit
	 */
	protected resetRemaining() {
		this.remaining = this.limit;
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = null;
		this.checkQueue();
	}

	/**
	 * Clear the current queue of events to be sent
	 */
	protected dropQueue() {
		this.fnQueue = [];
	}
}

export = LocalBucket;
