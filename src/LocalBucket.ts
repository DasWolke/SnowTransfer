"use strict";

/**
 * Bucket used for saving ratelimits
 * @protected
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

	public static readonly default = LocalBucket;

	/**
	 * Create a new bucket
	 * @param ratelimiter ratelimiter used for ratelimiting requests
	 * @param routeKey Key used internally to routify requests. Assigned by ratelimiter
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
	public queue<T>(fn: (bucket: LocalBucket) => T): Promise<T> {
		return new Promise(res => {
			const wrapFn = () => {
				this.remaining--;
				if (!this.resetTimeout) this.resetTimeout = setTimeout(() => this.resetRemaining(), this.reset);
				if (this.remaining !== 0) this.checkQueue();
				return res(fn(this));
			};
			this.fnQueue.push({ fn, callback: wrapFn });
			this.checkQueue();
		});
	}

	/**
	 * Check if there are any functions in the queue that haven't been executed yet
	 */
	public checkQueue(): void {
		if (this.ratelimiter.global) return;
		if (this.fnQueue.length && this.remaining !== 0) {
			const queuedFunc = this.fnQueue.splice(0, 1)[0];
			queuedFunc.callback();
		}
	}

	/**
	 * Reset the remaining tokens to the base limit
	 */
	private resetRemaining(): void {
		this.remaining = this.limit;
		if (this.resetTimeout) {
			clearTimeout(this.resetTimeout);
			this.resetTimeout = null;
		}
		if (this.fnQueue.length) this.checkQueue();
		else delete this.ratelimiter.buckets[this.routeKey];
	}

	/**
	 * Clear the current queue of events to be sent
	 */
	public dropQueue(): void {
		this.fnQueue.length = 0;
	}
}

export = LocalBucket;
