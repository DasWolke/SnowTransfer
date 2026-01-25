/* eslint-disable no-async-promise-executor */

import fs = require("fs");
import path = require("path");
import { EventEmitter } from "events";
import crypto = require("crypto");
import util = require("util");

import Endpoints = require("./Endpoints");
const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf8" })); // otherwise, the json was included in the build
import Constants = require("./Constants");
import SM = require("./StateMachine");

import type { HTTPMethod, RatelimitInfo, RequestEventData, HandlerEvents } from "./Types";

// const applicationJSONRegex = /application\/json/;
const routeRegex = /\/([a-z-]+)\/(?:\d+)/g;
const reactionsRegex = /\/reactions\/[^/]+/g;
const reactionsUserRegex = /\/reactions\/:id\/[^/]+/g;
const webhooksRegex = /^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/;
const isMessageEndpointRegex = /\/messages\/:id$/;
const isGuildChannelsRegex = /\/guilds\/\d+\/channels$/;
const messagesRegex = /\/messages\/\d+$/;

const disallowedBodyMethods = new Set(["head", "get", "delete"]);

/**
 * @since 0.3.0
 * @protected
 */
export class DiscordAPIError extends Error {
	public method: string;
	public path: string;
	public code: number;
	public httpStatus: number;
	public request: RequestEventData;
	public response: Response;

	public constructor(error: { message?: string; code?: number; }, request: RequestEventData, response: Response) {
		super();
		this.name = "DiscordAPIError";
		this.message = error.message ?? util.inspect(error);
		this.method = request.method;
		this.path = request.endpoint;
		this.code = error.code ?? 4000;
		this.httpStatus = response.status;

		Object.defineProperties(this, {
			request: { enumerable: false, value: request },
			response: { enumerable: false, value: response },
		});
	}
}

/**
 * @since 0.17.0
 */
export interface Counter {
	id: string;
	/**
	 * Like new.
	 * @since 0.17.0
	 */
	hasReset(): boolean;
	/**
	 * Returns true only if the caller is allowed to call take() and then consume a function.
	 * @since 0.17.0
	 */
	canTake(): boolean;
	/**
	 * Take a use out of the counter
	 * @since 0.17.0
	 */
	take(): boolean;
	/** @since 0.17.0 */
	timeUntilReset(): number;
	/** @since 0.17.0 */
	responseReceived(): void;
	/** @since 0.17.0 */
	applyCount(limit: number | null, remaining: number, resetAfter: number): void;
}

/**
 * @since 0.17.0
 */
export class IntervalCounter implements Counter {
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	public remaining: number;

	private firstRequestTime = 0;

	private resetAt: number | null = null;

	public id = new Array(3).fill(0).map(() => String.fromCodePoint(Math.floor(Math.random()*26+65))).join("");

	/**
	 * Create a new base bucket
	 * @param limit Number of functions that may be executed during the timeframe set in reset
	 * @param reset Timeframe in milliseconds until the ratelimit resets after first
	 */
	public constructor(public limit: number, public reset: number) {
		this.remaining = limit;
	}

	private checkReset(): void {
		// Check if the counter has refreshed
		const now = Date.now();
		// If specific resetAt, use it (ignoring preset reset interval)
		if (this.resetAt !== null) {
			if (now > this.resetAt) {
				this.firstRequestTime = 0;
				this.remaining = this.limit;
				this.resetAt = null;
				if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [itrv] [${this.id}] informed reset: ${this.remaining}/${this.limit}`);
			}
		}
		// If no specific resetAt, count from first request and reset interval
		else if (now > this.firstRequestTime + this.reset) {
			this.firstRequestTime = 0;
			this.remaining = this.limit;
			if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [itrv] [${this.id}] predicted reset: ${this.remaining}/${this.limit}`);
		}
	}

	public hasReset(): boolean {
		this.checkReset();
		return this.remaining === this.limit;
	}

	public canTake(): boolean {
		this.checkReset();
		return this.remaining > 0;
	}

	public take(): boolean {
		this.checkReset();
		if (this.remaining === this.limit) this.firstRequestTime = Date.now();
		let ok = this.remaining > 0;
		this.remaining--;
		return ok;
	}

	public timeUntilReset(): number {
		const now = Date.now();
		if (this.resetAt) return Math.max(this.resetAt - now + 1, 0);
		else return Math.max(this.firstRequestTime + this.reset - Date.now() + 1, 0);
	}

	// update the firstRequestTime to represent the *response* time to avoid getting fucked by slight network latency inconsistencies after a bucket refresh
	public responseReceived(): void {
		if (this.remaining === this.limit-1 && this.firstRequestTime) this.firstRequestTime = Date.now()
	}

	public applyCount(limit: number | null, remaining: number, resetAfter: number): void {
		if (limit != null) this.limit = limit;
		this.remaining = remaining;
		this.resetAt = Date.now() + resetAfter;
	}
}

/**
 * @since 0.17.0
 */
export class LeakyCounter implements Counter {
	/**
	 * Remaining amount of executions during the current timeframe
	 */
	public remaining: number;

	private resetAt: number | null = null;

	public id = new Array(3).fill(0).map(() => String.fromCodePoint(Math.floor(Math.random()*26+65))).join("");

	/**
	 * Create a new base bucket
	 * @param limit Number of functions that may be executed until some are reset
	 */
	public constructor(public limit: number) {
		this.remaining = limit;
	}

	private checkReset(): void {
		// Check if the counter has refreshed
		const now = Date.now();
		if (this.resetAt && now > this.resetAt) {
			this.remaining = Math.min(this.limit, this.remaining + 1); // only restore one when it resets
			this.resetAt = null;
			if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [leak] [${this.id}] restore one: ${this.remaining}/${this.limit}`);
		}
	}

	public hasReset(): boolean {
		this.checkReset();
		return this.remaining === this.limit;
	}

	public canTake(): boolean {
		this.checkReset();
		return this.remaining > 0;
	}

	public take(): boolean {
		this.checkReset();
		if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [leak] [${this.id}] took: ${this.remaining-1} left`);
		return this.remaining-- > 0;
	}

	public timeUntilReset(): number {
		const now = Date.now();
		if (this.resetAt) return Math.max(this.resetAt - now + 1, 0);
		else return 0;
	}

	public responseReceived(): void {}

	public applyCount(limit: number | null, remaining: number, resetAfter: number): void {
		if (limit != null) this.limit = limit;
		this.remaining = remaining;
		this.resetAt = Date.now() + resetAfter;
		if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [leak] [${this.id}] applied: ${remaining}/${limit} - wait another ${resetAfter}`);
	}
}

/**
 * Bucket used for saving ratelimits
 * @since 0.1.0
 */
export class Bucket {
	/** Tracks the state this bucket is in (blocked, running, waiting, etc) and what operations are allowed. */
	public sm = new SM("ready");
	/** Wrapped functions which always resolve (not reject) after the original function has completed and resolved. The original function may manipulate rate limit buckets in that time before it resolves. */
	public calls: Array<() => any> = [];
	/** The backing counters of the bucket that determine how many functions can be consumed in a timeframe. */
	public counters: Array<Counter> = [];

	private pauseRequested = false;

	/**
	 * Create a new bucket
	 */
	public constructor(counters: Array<Counter>) {
		this.counters = counters;

		// nothing to do, nothing waiting for, the next request will be sent straight away
		this.sm.defineState("ready", {
			onEnter: [],
			onLeave: [],
			transitions: new Map([
				["enqueue", {
					destination: "check"
				}],
				["pause", {
					destination: "paused"
				}]
			])
		});

		// trying to send a request, but should first check if there are any requests etc
		this.sm.defineState("check", {
			onEnter: [
				() => {
					if (this.pauseRequested) {
						return this.sm.doTransition("pause");
					}
					if (!this.counters.every(c => c.canTake())) {
						return this.sm.doTransition("cooldown");
					}
					if (this.calls.length) {
						return this.sm.doTransition("run");
					}
					return this.sm.doTransition("empty");
				}
			],
			onLeave: [],
			transitions: new Map([
				["pause", {
					destination: "paused"
				}],
				["cooldown", {
					destination: "cooldown"
				}],
				["run", {
					destination: "running"
				}],
				["empty", {
					destination: "ready"
				}]
			])
		});

		// a request is in progress, can't do anything else until it gets back (the bucket is sequential)
		this.sm.defineState("running", {
			onEnter: [
				() => {
					// Take one from each counter
					this.counters.forEach(c => c.take());
					// Dequeue and run
					const cb = this.calls.shift();
					cb!().then(() => {
						this.sm.doTransition("complete");
					});
				}
			],
			onLeave: [],
			transitions: new Map([
				["complete", {
					destination: "check"
				}]
			])
		});

		// can't send more requests, waiting for rate limit reset. may or may not have pending requests
		this.sm.defineState("cooldown", {
			onEnter: [
				() => {
					this.sm.doTransitionLater("reset", Math.max(...this.counters.map(c => c.timeUntilReset())));
				}
			],
			onLeave: [],
			transitions: new Map([
				["reset", {
					destination: "check"
				}]
			])
		});

		// user has requested nothing to be sent for now
		this.sm.defineState("paused", {
			onEnter: [],
			onLeave: [
				() => {
					this.pauseRequested = false;
				}
			],
			transitions: new Map([
				["resume", {
					destination: "check"
				}]
			])
		});

		this.sm.freeze();
	}

	/**
	 * Queue a function to be executed
	 * @since 0.12.0
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public enqueue<T>(fn: (bkt: this) => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.calls.push(() => {
				return fn(this).then(resolve).catch(reject);
			});

			if (this.sm.currentStateName === "ready") this.sm.doTransition("enqueue");
		});
	}

	/**
	 * Pause the bucket from consuming more functions until resumed
	 * @since 0.16.0
	 */
	public pause(): void {
		this.pauseRequested = true;
		if (this.sm.currentStateName === "ready") this.sm.doTransition("pause");
	}

	/**
	 * If the bucket is paused, resume it
	 * @since 0.16.0
	 */
	public resume(): void {
		this.pauseRequested = false;
		if (this.sm.currentStateName !== "paused") return
		this.sm.doTransition("resume");
	}

	/**
	 * Clear the current queue of events to be sent
	 * @since 0.1.0
	 */
	public dropQueue(): void {
		this.calls = [];
	}
}

/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @since 0.1.0
 * @protected
 */
export class Ratelimiter {
	/**
	 * A Map of Buckets keyed by route keys that store rate limit info
	 */
	public buckets = new Map<string, Bucket>();
	/**
	 * The bucket that limits how many requests per second you can make globally
	 */
	public globalBucket = new Bucket([new IntervalCounter(Constants.GLOBAL_REQUESTS_PER_SECOND, 1000)]);

	/**
	 * If you're being globally rate limited
	 */
	public get global() {
		return !this.globalBucket.counters[0].canTake();
	}

	public constructor() {
		setInterval(() => {
			for (const [key, value] of this.buckets.entries()) {
				const counter = value.counters[0];
				if (counter.hasReset()) this.buckets.delete(key);
			}
		}, 1*60*60*1000).unref();
	}

	/**
	 * Returns a key for saving ratelimits for routes
	 * (Taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/RequestHandler.js) -> I luv u abal <3
	 * @since 0.1.0
	 * @param url url to reduce to a key something like /channels/266277541646434305/messages/266277541646434305/
	 * @param method method of the request, usual http methods like get, etc.
	 * @returns reduced url: /channels/266277541646434305/messages/:id/
	 */
	public routify(url: string, method: string): string {
		let route = url.replaceAll(routeRegex, function (match, p: string) {
			return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
		}).replaceAll(reactionsRegex, "/reactions/:id").replaceAll(reactionsUserRegex, "/reactions/:id/:userId").replace(webhooksRegex, "/webhooks/$1/:token");

		if (method === "DELETE" && isMessageEndpointRegex.test(route)) route = method + route;
		else if (method === "GET" && isGuildChannelsRegex.test(route)) route = "/guilds/:id/channels";

		if (method === "PUT" || method === "DELETE") {
			const index = route.indexOf("/reactions");
			if (index !== -1) route = "MODIFY" + route.slice(0, index + 10);
		}

		return route;
	}

	/**
	 * Choose a bucket from the route and enqueue a rest call in it
	 * @since 0.1.0
	 * @param fn function to call once the ratelimit is ready
	 * @param url Endpoint of the request
	 * @param method Http method used by the request
	 */
	public queue<T>(fn: (bucket: Bucket) => Promise<T>, url: string, method: string): Promise<T> {
		const routeKey = this.routify(url, method);

		let bucket = this.buckets.get(routeKey);
		if (!bucket) {
			if (method === "DELETE" && messagesRegex.test(url)) {
				bucket = new Bucket([new LeakyCounter(1), new IntervalCounter(5, 5000), this.globalBucket.counters[0]]);
			} else bucket = new Bucket([new LeakyCounter(1), this.globalBucket.counters[0]]);
			this.buckets.set(routeKey, bucket);
		}

		return bucket.enqueue(fn);
	}

	/**
	 * Set if this Ratelimiter is hitting a global ratelimit for `ms` duration
	 * @since 0.12.0
	 * @param ms How long in milliseconds this Ratelimiter is globally ratelimited for
	 */
	public setGlobal(ms: number): void {
		this.globalBucket.counters[0].applyCount(Constants.GLOBAL_REQUESTS_PER_SECOND, 0, ms);
	}
}

export namespace RequestHandler {
	export type Options = {
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
		headers: { Authorization?: string; "User-Agent": string; },
		fetch: typeof fetch
	}
}

/**
 * Request Handler class
 * @since 0.1.0
 * @protected
 */
export class RequestHandler extends EventEmitter<HandlerEvents> {
	public options: RequestHandler.Options;
	public latency: number;
	public apiURL: string;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(public ratelimiter: Ratelimiter, options?: { token?: string; } & Partial<Omit<RequestHandler.Options, "headers">>) {
		super();

		this.options = {
			baseHost: options?.baseHost ?? Endpoints.BASE_HOST,
			baseURL: options?.baseURL ?? Endpoints.BASE_URL,
			bypassBuckets: options?.bypassBuckets ?? false,
			retryFailed: options?.retryFailed ?? false,
			retryLimit: options?.retryLimit ?? Constants.DEFAULT_RETRY_LIMIT,
			headers: {
				"User-Agent": `Discordbot (https://github.com/DasWolke/SnowTransfer, ${version}) Node.js/${process.version}`
			},
			fetch: options?.fetch ?? fetch
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
	 * @param extraHeaders Any headers to send on top of the existing ones for this request
	 * @param retries How many retries should be performed for this request if it fails when possible and not a bad status code is returned
	 * @param rawResponse If the raw Response Object from fetch should be returned instead of trying to return a response.json() or undefined if no body
	 * @returns Result of the request
	 */
	public request(endpoint: string, params: Record<string, any> | undefined, method: HTTPMethod, dataType: "json", data?: any, extraHeaders?: Record<string, string>, retries?: number, rawResponse?: boolean): Promise<any>
	public request(endpoint: string, params: Record<string, any> | undefined, method: HTTPMethod, dataType: "multipart", data?: FormData, extraHeaders?: Record<string, string>, retries?: number, rawResponse?: boolean): Promise<any>
	public request(endpoint: string, params: Record<string, any> | undefined, method: HTTPMethod, dataType: "json" | "multipart", data?: any, extraHeaders?: Record<string, string>, retries?: number, rawResponse?: true): Promise<Response>
	public request(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, dataType: "json" | "multipart", data?: any, extraHeaders?: Record<string, string>, retries = this.options.retryLimit, rawResponse = false): Promise<any> {
		const stack = new Error().stack as string;
		return new Promise(async (resolve, reject) => {
			const fn = async (bkt?: Bucket | undefined) => {
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
					bkt?.counters.forEach(c => c.responseReceived());

					if (bkt) this._applyRatelimitHeaders(bkt, response.headers);

					if (response.status && !Constants.OK_STATUS_CODES.has(response.status) && response.status !== 429) {
						if (this.options.retryFailed && !Constants.DO_NOT_RETRY_STATUS_CODES.has(response.status) && retries !== 0) return this.request(endpoint, params, method, dataType as any, data, extraHeaders, retries--).then(resolve).catch(reject);
						throw new DiscordAPIError({ message: await response.text() }, request, response);
					}

					if (response.status === 429) {
						const b = await response.json() as RatelimitInfo; // Discord says it will be a JSON, so if there's an error, sucks
						if (b.global) this.ratelimiter.setGlobal(b.retry_after * 1000);
						if (globalThis.snowtransferDebugLogging) console.log(`${new Date().toISOString()} [rate] [${bkt?.counters[0].id}] !! 429 - guess there was 0 remaining, wait another ${b.retry_after*1000} (route: ${this.ratelimiter.routify(endpoint, method.toUpperCase())})`);
						this.emit("rateLimit", {
							method: method.toUpperCase(),
							path: endpoint,
							route: this.ratelimiter.routify(endpoint, method.toUpperCase())
						});

						throw new DiscordAPIError({ message: b.message, code: b.code ?? 429 }, request, response);
					}

					this.emit("done", reqId, response, request);

					if (rawResponse) return resolve(response);

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
					if (error?.stack) error.stack = error.stack + `\n${stack.split("\n").slice(1).join("\n")}`;
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
	private _applyRatelimitHeaders(bkt: Bucket, headers: Headers): void {
		const remaining = headers.get("x-ratelimit-remaining");
		const limit = headers.get("x-ratelimit-limit");
		const resetAfter = headers.get("x-ratelimit-reset-after");
		const isGlobal = headers.get("x-ratelimit-global");

		if (remaining === null && !bkt.counters[0].canTake() && !isGlobal) {
			// have to reset it now, or it'll never reset again
			bkt.counters[0].applyCount(null, 1, 0);
		}

		if (remaining && limit && resetAfter && !isGlobal) {
			bkt.counters[0].applyCount(Number.parseInt(limit), Number.parseInt(remaining), Number.parseFloat(resetAfter) * 1000);
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

		let body: string | undefined = undefined;
		if (!disallowedBodyMethods.has(method)) {
			if (typeof data === "object") body = JSON.stringify(data);
			else body = String(data);

			headers["Content-Type"] = "application/json";
		}

		return this.options.fetch(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
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

		return this.options.fetch(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
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
