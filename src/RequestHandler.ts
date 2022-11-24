/* eslint-disable no-async-promise-executor */

import { EventEmitter } from "events";
import crypto = require("crypto");

import FormData = require("form-data");

import Endpoints = require("./Endpoints");
import httpClient = require("./http");
const { version } = require("../package.json");
import Constants = require("./Constants");

export type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

const includesSlashBansRegex = /\/bans/;
const includesSlashPruneRegex = /\/prune/;
const applicationJSONRegex = /application\/json/;
const routeRegex = /\/([a-z-]+)\/(?:\d{17,19})/g;
const reactionsRegex = /\/reactions\/[^/]+/g;
const reactionsUserRegex = /\/reactions\/:id\/[^/]+/g;
const webhooksRegex = /^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/;
const isMessageEndpointRegex = /\/messages\/:id$/;
const isGuildChannelsRegex = /\/guilds\/\d+\/channels$/;

export class DiscordAPIError extends Error {
	public method: HTTPMethod;
	public path: string;
	public code: number;
	public httpStatus: number;

	public constructor(path: string, error: { message?: string; code?: number; }, method: HTTPMethod, status: number) {
		super();
		this.name = "DiscordAPIError";
		this.message = error.message || String(error);
		this.method = method;
		this.path = path;
		this.code = error.code ?? 4000;
		this.httpStatus = status;
	}
}

/**
 * Ratelimiter used for handling the ratelimits imposed by the rest api
 * @protected
 */
export class Ratelimiter {
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
			}, this.globalReset).unref();
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
		let route = url.replace(routeRegex, function (match, p: string) {
			return p === "channels" || p === "guilds" || p === "webhooks" ? match : `/${p}/:id`;
		}).replace(reactionsRegex, "/reactions/:id").replace(reactionsUserRegex, "/reactions/:id/:userID").replace(webhooksRegex, "/webhooks/$1/:token");

		if (method.toUpperCase() === "DELETE" && isMessageEndpointRegex.test(route)) route = method + route;
		else if (method.toUpperCase() === "GET" && isGuildChannelsRegex.test(route)) route = "/guilds/:id/channels";

		if(method === "PUT" || method === "DELETE") {
			const index = route.indexOf("/reactions");
			if(index !== -1) route = "MODIFY" + route.slice(0, index + 10);
		}
		return route;
	}

	/**
	 * Queue a rest call to be executed
	 * @param fn function to call once the ratelimit is ready
	 * @param url Endpoint of the request
	 * @param method Http method used by the request
	 */
	public queue(fn: (bucket: LocalBucket) => any, url: string, method: string) {
		const routeKey = this.routify(url, method);
		if (!this.buckets[routeKey]) this.buckets[routeKey] = new LocalBucket(this, routeKey);
		this.buckets[routeKey].queue(fn);
	}
}

/**
 * Bucket used for saving ratelimits
 * @protected
 */
export class LocalBucket {
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
	public ratelimiter: Ratelimiter;
	/**
	 * Key used internally to routify requests
	 */
	public routeKey: string;

	/**
	 * Create a new bucket
	 * @param ratelimiter ratelimiter used for ratelimiting requests
	 * @param routeKey Key used internally to routify requests. Assigned by ratelimiter
	 */
	public constructor(ratelimiter: Ratelimiter, routeKey: string) {
		this.ratelimiter = ratelimiter;
		this.routeKey = routeKey;
	}

	/**
	 * Queue a function to be executed
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public queue<T>(fn: (bucket: this) => T): Promise<T> {
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

type HandlerEvents = {
	request: [string, { endpoint: string, method: HTTPMethod, dataType: "json" | "multipart", data: any; }];
	done: [string, import("./http").ConnectionResponse];
	requestError: [string, Error];
	rateLimit: [{ timeout: number; limit: number; method: HTTPMethod; path: string; route: string; }];
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
 */
export class RequestHandler extends EventEmitter {
	public ratelimiter: Ratelimiter;
	public options: { baseHost: string; baseURL: string; headers: { Authorization?: string; "User-Agent": string; } };
	public latency: number;
	public apiURL: string;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(ratelimiter: Ratelimiter, options: { token?: string; baseHost: string; }) {
		super();

		this.ratelimiter = ratelimiter;
		this.options = {
			baseHost: Endpoints.BASE_HOST,
			baseURL: Endpoints.BASE_URL,
			headers: {
				"User-Agent": `Discordbot (https://github.com/DasWolke/SnowTransfer, ${version}) Node.js/${process.version}`
			}
		};
		if (options.token) this.options.headers.Authorization = options.token;
		this.options.baseHost = options.baseHost;

		this.apiURL = this.options.baseHost + Endpoints.BASE_URL;
		this.latency = 500;
	}

	/**
	 * Request a route from the discord api
	 * @param endpoint endpoint to request
	 * @param method http method to use
	 * @param dataType type of the data being sent
	 * @param data data to send, if any
	 * @returns Result of the request
	 */
	public request(endpoint: string, method: HTTPMethod, dataType: "json" | "multipart" = "json", data?: any): Promise<any> {
		if (typeof data === "number") data = String(data);
		// const stack = new Error().stack as string;
		return new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				try {
					this.emit("request", reqID, { endpoint, method, dataType, data: data ?? {} });

					let request: import("./http").ConnectionResponse;
					if (dataType == "json") request = await this._request(endpoint, method, data, (method === "get" || includesSlashBansRegex.test(endpoint) || includesSlashPruneRegex.test(endpoint)));
					else if (dataType == "multipart") request = await this._multiPartRequest(endpoint, method, data);
					else throw new Error("Forbidden dataType. Use json or multipart");

					if (request.status && !Constants.OK_STATUS_CODES.includes(request.status) && request.status !== 429) throw new DiscordAPIError(endpoint, request.headers["content-type"] && applicationJSONRegex.test(request.headers["content-type"]) ? { message: JSON.stringify(await request.json()) } : { message: String(request.body) }, method, request.status);

					this._applyRatelimitHeaders(bkt, request.headers);

					if (request.status === 429) {
						if (!this.ratelimiter.global) {
							const b = JSON.parse(String(request.body)); // Discord says it will be a JSON, so if there's an error, sucks
							if (b.reset_after !== undefined) this.ratelimiter.globalReset = b.reset_after * 1000;
							else this.ratelimiter.globalReset = 1000; // Should realistically never happen, but you never know
							if (b.global !== undefined) this.ratelimiter.global = b.global;
						}
						this.emit("rateLimit", { timeout: bkt.reset, limit: bkt.limit, method: method, path: endpoint, route: this.ratelimiter.routify(endpoint, method) });
						throw new DiscordAPIError(endpoint, { message: "You're being ratelimited", code: 429 }, method, request.status);
					}

					this.emit("done", reqID, request);

					if (request.body) {
						let b: any;
						try {
							b = JSON.parse(request.body.toString());
						} catch {
							res(undefined);
						}
						return res(b);
					} else return res(undefined);
				} catch (error) {
					// if (error && error.stack) error.stack = stack;
					this.emit("requestError", reqID, error);
					return rej(error);
				}
			}, endpoint, method);
		});
	}

	/**
	 * Apply the received ratelimit headers to the ratelimit bucket
	 * @param bkt Ratelimit bucket to apply the headers to
	 * @param headers Http headers received from discord
	 */
	private _applyRatelimitHeaders(bkt: LocalBucket, headers: any): void {
		if (headers["x-ratelimit-remaining"]) bkt.remaining = parseInt(headers["x-ratelimit-remaining"]);
		if (headers["x-ratelimit-limit"]) bkt.limit = parseInt(headers["x-ratelimit-limit"]);
		if (headers["x-ratelimit-reset"]) bkt.reset = parseInt(headers["x-ratelimit-reset"]) - Date.now();
	}

	/**
	 * Execute a normal json request
	 * @param endpoint Endpoint to use
	 * @param data Data to send
	 * @param useParams Whether to send the data in the body or use query params
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, method: HTTPMethod, data?: any, useParams = false): Promise<import("./http").ConnectionResponse> {
		const headers = { ...this.options.headers };
		if (typeof data !== "string" && data?.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}
		let url = `${this.apiURL}/${endpoint}`;
		let body: string | undefined = undefined;
		if (useParams && data && Object.keys(data).length) url += `?${Object.keys(data).map(k => `${k}=${data[k]}`).join("&")}`;
		else {
			if (data && typeof data === "object") {
				body = JSON.stringify(data);
				headers["Content-Type"] = "application/json";
			} else if (data) body = String(data);
		}
		const req = await httpClient.connect(url, { method, headers, bodyInit: body ? Buffer.from(body) : void 0 });
		const response = await httpClient.socketToRequest(req);
		req.end();
		return response;
	}

	/**
	 * Execute a multipart/form-data request
	 * @param endpoint Endpoint to use
	 * @param method Http Method to use
	 * @param data data to send
	 * @returns Result of the request
	 */
	private async _multiPartRequest(endpoint: string, method: HTTPMethod, data: { files?: [{ name: string; file?: Buffer; }], data?: any }): Promise<import("./http").ConnectionResponse> {
		const form = new FormData();
		if (data.files && Array.isArray(data.files) && data.files.every(f => !!f.name && !!f.file)) {
			let index = 0;
			for (const file of data.files) {
				form.append(`files[${index}]`, file.file, { filename: file.name });
				delete file.file;
				index++;
			}
		}
		if (data.data) delete data.files; // Interactions responses are weird, but I need to support it
		form.append("payload_json", JSON.stringify(data));
		// duplicate headers in options as to not risk mutating the state.
		const headers = { ...this.options.headers, ...form.getHeaders() };
		const req = await httpClient.connect(`${this.apiURL}/${endpoint}`, { method, headers, bodyInit: form.getBuffer() });
		const response = await httpClient.socketToRequest(req);
		req.end();
		return response;
	}
}
