import LocalBucket from "./LocalBucket";

/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @protected
 */
class Ratelimiter {
	public buckets: { [routeKey: string]: LocalBucket; };
	public global: boolean;
	public globalResetAt: number;

	/**
	 * This is an interval to constantly check Buckets which should be reset or unreferenced from the RateLimiter to be swept by the garbage collector.
	 * This 1 timeout is more performant as compared to potentially many more ticking timers to reset individual bucket remaining values.
	 *
	 * YOU SHOULD NEVER OVERRIDE THIS UNLESS YOU KNOW WHAT YOU'RE DOING. REQUESTS MAY POSSIBLY NEVER EXECUTE WITHOUT THIS AND/OR MEMORY MAY SLOWLY CLIMB OVER TIME.
	 */
	protected _timeout: NodeJS.Timeout;
	protected _timeoutFN: () => void;
	protected _timeoutDuration = 1000;

	public constructor() {
		this.buckets = {};
		this.global = false;
		this.globalResetAt = 0;

		this._timeoutFN = () => {
			for (const routeKey of Object.keys(this.buckets)) {
				const bkt = this.buckets[routeKey];
				if (bkt.resetAt && bkt.resetAt < Date.now()) {
					if (bkt.fnQueue.length) bkt.resetRemaining();
					else delete this.buckets[routeKey];
				} else if (!bkt.resetAt && this.global && this.globalResetAt < Date.now()) {
					if (bkt.fnQueue.length) bkt.checkQueue();
					else delete this.buckets[routeKey];
				}
			}
		};
		this._timeout = setInterval(() => { this._timeoutFN(); }, this._timeoutDuration);
	}

	/**
	 * Returns a key for saving ratelimits for routes
	 * (Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js) -> I luv u abal <3
	 * @param url url to reduce to a key something like /channels/266277541646434305/messages/266277541646434305/
	 * @param method method of the request, usual http methods like get, etc.
	 * @returns reduced url: /channels/266277541646434305/messages/:id/
	 */
	public routify(url: string, method: string): string {
		let route = url.replace(/\/([a-z-]+)\/(?:\d+)/g, function (match, p) {
			return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
		}).replace(/\/reactions\/[^/]+/g, "/reactions/:id").replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:token");
		if (method.toUpperCase() === "DELETE" && route.endsWith("/messages/:id")) route = method + route; // Delete Messsage endpoint has its own ratelimit
		return route;
	}

	/**
	 * Queue a rest call to be executed
	 * @param fn function to call once the ratelimit is ready
	 * @param url Endpoint of the request
	 * @param method Http method used by the request
	 */
	public queue(fn: (bucket: import("./LocalBucket")) => any, url: string, method: string) {
		const routeKey = this.routify(url, method);
		if (!this.buckets[routeKey]) this.buckets[routeKey] = new LocalBucket(this);
		this.buckets[routeKey].queue(fn);
	}
}

export = Ratelimiter;
