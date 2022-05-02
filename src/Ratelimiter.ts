import LocalBucket from "./LocalBucket";

/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @protected
 */
class Ratelimiter {
	/**
	 * An object of Buckets that store rate limit info
	 */
	public buckets: { [routeKey: string]: LocalBucket; } = {};
	/**
	 * If you're being globally rate limited
	 */
	private _global = false;
	/**
	 * Timeframe in milliseconds until when the global rate limit resets
	 */
	public globalReset = 0;
	/**
	 * Timeout that resets the global ratelimit once the timeframe has passed
	 */
	public globalResetTimeout: NodeJS.Timeout | null = null;

	public static default = Ratelimiter;

	/**
	 * If you're being globally rate limited
	 */
	public get global() {
		return this._global;
	}

	/**
	 * If you're being globally rate limited
	 */
	public set global(value) {
		if (value && this.globalReset !== 0) {
			if (this.globalResetTimeout) clearTimeout(this.globalResetTimeout);
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const instance = this;
			this.globalResetTimeout = setTimeout(() => {
				instance.global = false;
			}, this.globalReset);
		} else {
			if (this.globalResetTimeout) clearTimeout(this.globalResetTimeout);
			this.globalResetTimeout = null;
			this.globalReset = 0;
			for (const bkt of Object.values(this.buckets)) {
				bkt.checkQueue();
			}
		}
		this._global = value;
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
		if (!this.buckets[routeKey]) this.buckets[routeKey] = new LocalBucket(this, routeKey);
		this.buckets[routeKey].queue(fn);
	}
}

export = Ratelimiter;
