"use strict";

/**
 * Bucket used for saving ratelimits
 */
class LocalBucket {
	/**
	 * array of functions waiting to be executed
	 */
	public fnQueue: Array<{ fn: (...args: Array<any>) => any; callback: () => any; }>;
	/**
	 * Number of functions that may be executed during the timeframe set in limitReset
	 */
	public limit: number;
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	protected _remaining: number;
	/**
	 * Timeframe in milliseconds until the ratelimit resets
	 */
	public reset: number;
	/**
	 * The Date time in which the bucket will reset
	 */
	public resetAt: number | null;
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
		this._remaining = 1;
		this.reset = 5000;
		this.resetAt = null;
		this.ratelimiter = ratelimiter;
	}

	public get remaining() {
		if (this.resetAt && this.resetAt <= Date.now()) {
			this._remaining = this.limit;
			this.resetAt = null;
		}

		return this._remaining;
	}

	public set remaining(value) {
		this._remaining = value;
	}

	/**
	 * Queue a function to be executed
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public queue(fn: (bucket: LocalBucket) => any | Promise<any>): Promise<any> {
		return new Promise((res, rej) => {
			const wrapFn = () => {
				if (fn instanceof Promise) return fn.then(res).catch(rej);
				return res(fn(this));
			};
			this.fnQueue.push({ fn, callback: wrapFn });
			this.checkQueue();
		});
	}

	/**
	 * Check if there are any functions in the queue that haven't been executed yet
	 */
	public checkQueue() {
		if (this.reset < 0) this.reset = 100;
		if (this.ratelimiter.global && this.ratelimiter.globalResetAt > Date.now()) return;
		if (this.fnQueue.length > 0 && this.remaining !== 0) {
			const queuedFunc = this.fnQueue.splice(0, 1)[0];
			queuedFunc.callback();
			this.checkQueue();
		}
	}

	/**
	 * Reset the remaining tokens to the base limit
	 */
	public resetRemaining() {
		this._remaining = this.limit;
		this.resetAt = null;
		this.checkQueue();
	}

	/**
	 * Clear the current queue of events to be sent
	 */
	public dropQueue() {
		this.fnQueue.length = 0;
	}
}

export = LocalBucket;
