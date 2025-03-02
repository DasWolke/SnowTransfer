/* eslint-disable no-async-promise-executor */

import fs = require("fs");
import path = require("path");
import { EventEmitter } from "events";
import crypto = require("crypto");

import Endpoints = require("./Endpoints");
const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf8" })); // otherwise, the json was included in the build
import Constants = require("./Constants");

export type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

export type RESTPostAPIAttachmentsRefreshURLsResult = {
	refreshed_urls: Array<{
		original: string;
		refreshed: string;
	}>;
}

export type RatelimitInfo = {
	message: string;
	retry_after: number;
	global: boolean;
	code?: number;
}

/**
 * Interface for Queue types to implement
 * @since 0.12.0
 */
export interface Queue {
	/**
	 * Array of functions waiting to be executed
	 */
	calls: Array<() => any>;
	/**
	 * If the queue is currently executing functions
	 */
	running: boolean;
	/**
	 * If the queue is blocked from executing functions
	 */
	blocked: boolean;

	/**
	 * Queue a function to be executed
	 * @since 0.12.0
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	enqueue<T>(fn: () => T): Promise<T>;
	/**
	 * Set if this queue should be blocked from executing functions
	 * @since 0.12.0
	 * @param blocked If this queue should be blocked from executing functions
	 */
	setBlocked(blocked: boolean): void;
	/**
	 * @since 0.12.0
	 * Drop the queue of functions
	 */
	drop(): void;
}

// const applicationJSONRegex = /application\/json/;
const routeRegex = /\/([a-z-]+)\/(?:\d+)/g;
const reactionsRegex = /\/reactions\/[^/]+/g;
const reactionsUserRegex = /\/reactions\/:id\/[^/]+/g;
const webhooksRegex = /^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/;
const isMessageEndpointRegex = /\/messages\/:id$/;
const isGuildChannelsRegex = /\/guilds\/\d+\/channels$/;

const disallowedBodyMethods = new Set(["head", "get", "delete"]);

/**
 * @since 0.3.0
 */
export class DiscordAPIError extends Error {
	public method: string;
	public path: string;
	public code: number;
	public httpStatus: number;

	public constructor(error: { message?: string; code?: number; }, public request: RequestEventData, public response: Response) {
		super();
		this.name = "DiscordAPIError";
		this.message = error.message ?? String(error);
		this.method = request.method;
		this.path = request.endpoint;
		this.code = error.code ?? 4000;
		this.httpStatus = response.status;
	}
}

/**
 * A structure to queue (async) functions to run one at a time, waiting for each one to finish before continuing
 * @since 0.12.0
 * @protected
 */
export class AsyncSequentialQueue implements Queue {
	public calls: Array<() => any> = [];

	private _blocked = false;
	private _running = false;

	public get blocked(): boolean {
		return this._blocked;
	}

	public get running(): boolean {
		return this._running;
	}

	public enqueue<T>(fn: () => T): Promise<T> {
		return new Promise((resolve, reject) => {
			const wrapped = async () => {
				try {
					resolve(await fn());
				} catch (e) {
					reject(e as Error);
				}
			}

			this.calls.push(wrapped);
			this._tryRun();
		});
	}

	public setBlocked(blocked: boolean): void {
		this._blocked = blocked;
		this._tryRun();
	}

	public drop(): void {
		this.calls.length = 0;
		this._running = false;
	}

	private _tryRun(): void {
		if (this._blocked || this._running) return;
		this._running = true;
		this._next();
	}

	private async _next(): Promise<void> {
		if (this._blocked || !this._running) return
		const cb = this.calls.shift();
		await cb?.();
		if (this.calls.length && !this._blocked) setImmediate(() => this._next());
		else this._running = false;
	}
}

/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @since 0.1.0
 * @protected
 */
export class Ratelimiter<B extends typeof GlobalBucket = typeof GlobalBucket> {
	/**
	 * A Map of Buckets keyed by route keys that store rate limit info
	 */
	public buckets = new Map<string, InstanceType<B>>();
	/**
	 * The bucket that limits how many requests per second you can make globally
	 */
	public globalBucket = new LocalBucket(Constants.GLOBAL_REQUESTS_PER_SECOND, 1000);

	/**
	 * If you're being globally rate limited
	 */
	public get global() {
		return this.globalBucket.remaining === 0;
	}

	/**
	 * Construct a new Ratelimiter
	 * @param BucketConstructor The constructor function to call new on when creating buckets to cache and use
	 */
	public constructor(public BucketConstructor: B = GlobalBucket as B) {}

	/**
	 * Returns a key for saving ratelimits for routes
	 * (Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js) -> I luv u abal <3
	 * @since 0.1.0
	 * @param url url to reduce to a key something like /channels/266277541646434305/messages/266277541646434305/
	 * @param method method of the request, usual http methods like get, etc.
	 * @returns reduced url: /channels/266277541646434305/messages/:id/
	 */
	public routify(url: string, method: string): string {
		let route = url.replace(routeRegex, function (match, p: string) {
			return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
		}).replace(reactionsRegex, "/reactions/:id").replace(reactionsUserRegex, "/reactions/:id/:userId").replace(webhooksRegex, "/webhooks/$1/:token");

		if (method === "DELETE" && isMessageEndpointRegex.test(route)) route = method + route;
		else if (method === "GET" && isGuildChannelsRegex.test(route)) route = "/guilds/:id/channels";

		if (method === "PUT" || method === "DELETE") {
			const index = route.indexOf("/reactions");
			if (index !== -1) route = "MODIFY" + route.slice(0, index + 10);
		}

		return route;
	}

	/**
	 * Queue a rest call to be executed
	 * @since 0.1.0
	 * @param fn function to call once the ratelimit is ready
	 * @param url Endpoint of the request
	 * @param method Http method used by the request
	 */
	public queue<T>(fn: (bucket: InstanceType<B>) => T, url: string, method: string): Promise<T> {
		const routeKey = this.routify(url, method);

		let bucket = this.buckets.get(routeKey);
		if (!bucket) {
			bucket = new this.BucketConstructor(this, routeKey) as InstanceType<B>;
			this.buckets.set(routeKey, bucket);
		}

		return new Promise<T>((resolve, reject) => {
			this.globalBucket.enqueue(() => {
				bucket.enqueue(fn).then(resolve).catch(reject);
			});
		});
	}

	/**
	 * Set if this Ratelimiter is hitting a global ratelimit for `ms` duration
	 * @param ms How long in milliseconds this Ratelimiter is globally ratelimited for
	 */
	public setGlobal(ms: number): void {
		this.globalBucket.remaining = 0;
		this.globalBucket.queue.setBlocked(true);
		this.globalBucket.makeResetTimeout(ms);
	}
}

/**
 * Bucket used for saving ratelimits
 * @since 0.1.0
 * @protected
 */
export class LocalBucket {
	/**
	 * The backing Queue of functions passed to this bucket
	 */
	public queue: Queue = new AsyncSequentialQueue();
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	public remaining: number;

	private resetTimeout: NodeJS.Timeout | null = null;

	/**
	 * Create a new base bucket
	 * @param limit Number of functions that may be executed during the timeframe set in reset
	 * @param reset Timeframe in milliseconds until the ratelimit resets after first
	 * @param remaining Remaining amount of executions during the current timeframe
	 */
	public constructor(public limit = 5, public reset = 5000, remaining?: number) {
		this.remaining = remaining ?? limit;
	}

	/**
	 * Queue a function to be executed
	 * @since 0.12.0
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public enqueue<T>(fn: (bkt: this) => T): Promise<T> {
		return this.queue.enqueue<T>(() => {
			this.remaining--;
			if (this.remaining === 0) this.queue.setBlocked(true);
			if (!this.resetTimeout) this.makeResetTimeout(this.reset);

			return fn(this);
		});
	}

	/**
	 * Reset/make the timeout of this bucket
	 * @since 0.8.3
	 * @param ms Timeframe in milliseconds until the ratelimit resets after
	 */
	public makeResetTimeout(ms: number): void {
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = setTimeout(() => this.resetRemaining(), ms).unref();
	}

	/**
	 * Reset the remaining tokens to the base limit
	 * @since 0.1.0
	 */
	public resetRemaining(): void {
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = null;

		this.remaining = this.limit;
		this.queue.setBlocked(false);
	}

	/**
	 * Clear the current queue of events to be sent
	 * @since 0.1.0
	 */
	public dropQueue(): void {
		this.queue.drop();
	}
}

/**
 * Extended bucket that respects global ratelimits
 * @since 0.10.0
 * @protected
 */
export class GlobalBucket extends LocalBucket {
	/**
	 * Create a new bucket that respects global rate limits
	 * @param ratelimiter ratelimiter used for ratelimiting requests. Assigned by ratelimiter
	 * @param routeKey Key used internally to routify requests. Assigned by ratelimiter
	 */
	public constructor(public readonly ratelimiter: Ratelimiter, public readonly routeKey: string, limit = 5, reset = 5000, remaining?: number) {
		super(limit, reset, remaining);
	}

	/**
	 * Reset the remaining tokens to the base limit
	 * @since 0.10.0
	 */
	public resetRemaining(): void {
		if (!this.queue.calls.length) this.ratelimiter.buckets.delete(this.routeKey);
		super.resetRemaining();
	}
}

type RequestEventData = {
	endpoint: string;
	method: string;
	dataType: "json" | "multipart";
	data: any;
};

export type HandlerEvents = {
	request: [string, RequestEventData];
	done: [string, Response, RequestEventData];
	requestError: [string, Error];
	rateLimit: [{ timeout: number; remaining: number; limit: number; method: string; path: string; route: string; }];
}

export interface RequestHandler {
	addListener<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	emit<E extends keyof HandlerEvents>(event: E, ...args: HandlerEvents[E]): boolean;
	eventNames(): Array<keyof HandlerEvents>;
	listenerCount(event: keyof HandlerEvents): number;
	listeners(event: keyof HandlerEvents): Array<(...args: Array<any>) => any>;
	off<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	on<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	once<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	prependListener<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	prependOnceListener<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
	rawListeners(event: keyof HandlerEvents): Array<(...args: Array<any>) => any>;
	removeAllListeners(event?: keyof HandlerEvents): this;
	removeListener<E extends keyof HandlerEvents>(event: E, listener: (...args: HandlerEvents[E]) => any): this;
}

/**
 * Request Handler class
 * @since 0.1.0
 */
export class RequestHandler extends EventEmitter {
	public options: {
		/** The base URL to use when making requests. Defaults to https://discord.com */
		baseHost: string;
		/** The base path of the base URL to use for the API. Defaults to /api/v${Constants.REST_API_VERSION} */
		baseURL: string;
		/** If rate limit buckets should be ignored */
		bypassBuckets: boolean;
		/** If failed requests that can be retried should be retried, up to retryLimit times. */
		retryFailed: boolean;
		/** How many times requests should be retried if they fail and can be retried. */
		retryLimit: number;
		headers: { Authorization?: string; "User-Agent": string; }
	};
	public latency: number;
	public apiURL: string;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(public ratelimiter: Ratelimiter, options?: { token?: string; } & Partial<Omit<RequestHandler["options"], "headers">>) {
		super();

		this.options = {
			baseHost: options?.baseHost ?? Endpoints.BASE_HOST,
			baseURL: options?.baseURL ?? Endpoints.BASE_URL,
			bypassBuckets: options?.bypassBuckets ?? false,
			retryFailed: options?.retryFailed ?? false,
			retryLimit: options?.retryLimit ?? Constants.DEFAULT_RETRY_LIMIT,
			headers: {
				"User-Agent": `Discordbot (https://github.com/DasWolke/SnowTransfer, ${version}) Node.js/${process.version}`
			}
		};
		if (options?.token) this.options.headers.Authorization = options.token;

		this.apiURL = this.options.baseHost + Endpoints.BASE_URL;
		this.latency = 500;
	}

	/**
	 * Request a route from the discord api
	 * @since 0.1.0
	 * @param endpoint endpoint to request
	 * @param params URL query parameters to add on to the URL
	 * @param method http method to use
	 * @param dataType type of the data being sent
	 * @param data data to send, if any
	 * @returns Result of the request
	 */
	public request(endpoint: string, params: Record<string, any> | undefined, method: HTTPMethod, dataType: "json", data?: any, extraHeaders?: Record<string, string>, retries?: number): Promise<any>
	public request(endpoint: string, params: Record<string, any> | undefined, method: HTTPMethod, dataType: "multipart", data?: FormData, extraHeaders?: Record<string, string>, retries?: number): Promise<any>
	public request(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, dataType: "json" | "multipart", data?: any, extraHeaders?: Record<string, string>, retries = this.options.retryLimit): Promise<any> {
		// const stack = new Error().stack as string;
		return new Promise(async (resolve, reject) => {
			const fn = async (bkt?: GlobalBucket | undefined) => {
				const reqId = crypto.randomBytes(20).toString("hex");
				try {
					const request = { endpoint, method: method.toUpperCase(), dataType, data: data ?? {} };
					this.emit("request", reqId, request);

					const before = Date.now();

					let response: Response;
					switch (dataType) {
					case "json":
						response = await this._request(endpoint, params, method, data, extraHeaders);
						break;
					case "multipart":
						if (!data) throw new Error("No multipart data");
						response = await this._multiPartRequest(endpoint, params, method, data, extraHeaders);
						break;
					default:
						throw new Error("Forbidden dataType. Use json or multipart or ensure multipart has FormData");
					}

					this.latency = Date.now() - before;

					if (bkt) this._applyRatelimitHeaders(bkt, response.headers);

					if (response.status && !Constants.OK_STATUS_CODES.has(response.status) && response.status !== 429) {
						if (this.options.retryFailed && !Constants.DO_NOT_RETRY_STATUS_CODES.has(response.status) && retries !== 0) return this.request(endpoint, params, method, dataType as any, data, extraHeaders, retries--).then(resolve).catch(reject);
						throw new DiscordAPIError({ message: await response.text() }, request, response);
					}

					if (response.status === 429) {
						const b = await response.json() as RatelimitInfo; // Discord says it will be a JSON, so if there's an error, sucks
						if (b.global) this.ratelimiter.setGlobal(b.retry_after * 1000);
						else bkt?.queue.setBlocked(true);

						this.emit("rateLimit", {
							timeout: bkt?.reset ?? b.retry_after * 1000,
							remaining: 0,
							limit: bkt?.limit ?? Infinity,
							method: method.toUpperCase(),
							path: endpoint,
							route: bkt?.routeKey ?? this.ratelimiter.routify(endpoint, method.toUpperCase())
						});

						throw new DiscordAPIError({ message: b.message, code: b.code ?? 429 }, request, response);
					}

					this.emit("done", reqId, response, request);

					if (response.body) {
						let b: any;
						try {
							b = await response.json();
						} catch {
							return resolve(undefined);
						}
						return resolve(b);
					} else return resolve(undefined);
				} catch (error) {
					// if (error && error.stack) error.stack = stack;
					this.emit("requestError", reqId, error);
					return reject(error as Error);
				}
			};

			if (this.options.bypassBuckets) fn();
			else this.ratelimiter.queue(fn, endpoint, method.toUpperCase());
		});
	}

	/**
	 * Apply the received ratelimit headers to the ratelimit bucket
	 * @since 0.1.0
	 * @param bkt Ratelimit bucket to apply the headers to
	 * @param headers Http headers received from discord
	 */
	private _applyRatelimitHeaders(bkt: GlobalBucket, headers: Headers): void {
		const remaining = headers.get("x-ratelimit-remaining");
		const limit = headers.get("x-ratelimit-limit");
		const resetAfter = headers.get("x-ratelimit-reset-after");

		if (remaining) bkt.remaining = parseInt(remaining);
		if (limit) bkt.limit = parseInt(limit);
		if (resetAfter) {
			bkt.reset = parseFloat(resetAfter) * 1000;
			bkt.makeResetTimeout(bkt.reset);
		}
	}

	/**
	 * Execute a normal json request
	 * @since 0.1.0
	 * @param endpoint Endpoint to use
	 * @param params URL query parameters to add on to the URL
	 * @param data Data to send
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, data?: any, extraHeaders?: Record<string, string>): Promise<Response> {
		const headers = { ...this.options.headers, ...extraHeaders };
		if (typeof data !== "string" && data?.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}

		let body: string | undefined = undefined;
		if (!disallowedBodyMethods.has(method)) {
			if (typeof data === "object") body = JSON.stringify(data);
			else body = String(data);
		}

		headers["Content-Type"] = "application/json";

		return fetch(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
			method: method.toUpperCase(),
			headers,
			body
		});
	}

	/**
	 * Execute a multipart/form-data request
	 * @since 0.1.0
	 * @param endpoint Endpoint to use
	 * @param params URL query parameters to add on to the URL
	 * @param method Http Method to use
	 * @param data data to send
	 * @returns Result of the request
	 */
	private async _multiPartRequest(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, data: FormData, extraHeaders?: Record<string, string>): Promise<Response> {
		const headers = { ...this.options.headers, ...extraHeaders };

		return fetch(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
			method: method.toUpperCase(),
			headers,
			body: data
		});
	}
}

function appendQuery(query: Record<string, any>): string {
	let count = 0;
	for (const [key, value] of Object.entries(query)) {
		if (value == undefined) delete query[key];
		else count++;
	}

	return count > 0 ? `?${new URLSearchParams(query).toString()}` : "";
}
