/* eslint-disable no-async-promise-executor */

import { EventEmitter } from "events";
import crypto = require("crypto");

import FormData = require("form-data");
import undici = require("undici"); // Not using global.fetch yet until the Node ecosystem matures

import Endpoints = require("./Endpoints");
const { version } = require("../package.json");
import Constants = require("./Constants");
import { Readable, pipeline } from "stream";
import type { ReadableStream } from "stream/web";

export type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

// const applicationJSONRegex = /application\/json/;
const routeRegex = /\/([a-z-]+)\/(?:\d{17,19})/g;
const reactionsRegex = /\/reactions\/[^/]+/g;
const reactionsUserRegex = /\/reactions\/:id\/[^/]+/g;
const webhooksRegex = /^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/;
const isMessageEndpointRegex = /\/messages\/:id$/;
const isGuildChannelsRegex = /\/guilds\/\d+\/channels$/;

export class DiscordAPIError extends Error {
	public code: number;
	public httpStatus: number;

	public constructor(public path: string, error: { message?: string; code?: number; }, public method: HTTPMethod, status: number) {
		super();
		this.name = "DiscordAPIError";
		this.message = error.message ?? String(error);
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

		if (method === "PUT" || method === "DELETE") {
			const index = route.indexOf("/reactions");
			if (index !== -1) route = "MODIFY" + route.slice(0, index + 10);
		}
		return route;
	}

	/**
	 * Queue a rest call to be executed
	 * @param fn function to call once the ratelimit is ready
	 * @param url Endpoint of the request
	 * @param method Http method used by the request
	 */
	public queue(fn: (bucket: LocalBucket) => any, url: string, method: string): void {
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
	 * Create a new bucket
	 * @param ratelimiter ratelimiter used for ratelimiting requests
	 * @param routeKey Key used internally to routify requests. Assigned by ratelimiter
	 */
	public constructor(public ratelimiter: Ratelimiter, public routeKey: string) {}

	/**
	 * Queue a function to be executed
	 * @param fn function to be executed
	 * @returns Result of the function if any
	 */
	public queue<T>(fn: (bucket: this) => T): Promise<T> {
		return new Promise(res => {
			const wrapFn = () => {
				this.remaining--;
				// Placeholder until we get the real time remaining. When the request gets a response the headers will tell the real time.
				if (!this.resetTimeout) this.makeResetTimeout(5000);
				if (this.remaining !== 0) this.checkQueue();
				return res(fn(this));
			};
			this.fnQueue.push({ fn, callback: wrapFn });
			this.checkQueue();
		});
	}

	public makeResetTimeout(durationMS: number) {
		if (this.resetTimeout) clearTimeout(this.resetTimeout);
		this.resetTimeout = setTimeout(() => this.resetRemaining(), durationMS);
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
	done: [string, IResponse];
	requestError: [string, Error];
	rateLimit: [{ timeout: number; remaining: number; limit: number; method: HTTPMethod; path: string; route: string; }];
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
	public options: { baseHost: string; baseURL: string; headers: { Authorization?: string; "User-Agent": string; } };
	public latency: number;
	public apiURL: string;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(public ratelimiter: Ratelimiter, options: { token?: string; baseHost: string; }) {
		super();

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
	 * @param params URL query parameters to add on to the URL
	 * @param method http method to use
	 * @param dataType type of the data being sent
	 * @param data data to send, if any
	 * @returns Result of the request
	 */
	public request<T extends "json" | "multipart">(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, dataType: T = "json" as T, data?: T extends "json" ? any : FormData, extraHeaders?: Record<string, string>): Promise<any> {
		// const stack = new Error().stack as string;
		return new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				try {
					this.emit("request", reqID, { endpoint, method, dataType, data: data ?? {} });

					const before = Date.now();

					let request: IResponse;
					if (dataType == "json") request = await this._request(endpoint, params, method, data, extraHeaders);
					else if (dataType == "multipart" && data) request = await this._multiPartRequest(endpoint, params, method, data);
					else throw new Error("Forbidden dataType. Use json or multipart or ensure multipart has FormData");

					this.latency = Date.now() - before;

					this._applyRatelimitHeaders(bkt, request.headers);

					if (request.status && !Constants.OK_STATUS_CODES.includes(request.status) && request.status !== 429) {
						throw new DiscordAPIError(
							endpoint,
							{ message: await request.text() },
							method,
							request.status
						);
					}

					if (request.status === 429) {
						if (!this.ratelimiter.global) {
							const b = await request.json() as any; // Discord says it will be a JSON, so if there's an error, sucks
							if (b.reset_after !== undefined) this.ratelimiter.globalReset = b.reset_after * 1000;
							else this.ratelimiter.globalReset = 1000; // Should realistically never happen, but you never know
							if (b.global !== undefined) this.ratelimiter.global = b.global;
						}
						this.emit("rateLimit", { timeout: bkt.reset, remaining: bkt.remaining, limit: bkt.limit, method: method, path: endpoint, route: this.ratelimiter.routify(endpoint, method) });
						throw new DiscordAPIError(endpoint, { message: "You're being ratelimited", code: 429 }, method, request.status);
					}

					this.emit("done", reqID, request);

					if (request.body) {
						let b: any;
						try {
							b = await request.json();
						} catch {
							return res(undefined);
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
	private _applyRatelimitHeaders(bkt: LocalBucket, headers: undici.Headers): void {
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
	 * @param endpoint Endpoint to use
	 * @param params URL query parameters to add on to the URL
	 * @param data Data to send
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, data?: any, extraHeaders?: Record<string, string>): Promise<IResponse> {
		const headers = { ...this.options.headers };
		if (extraHeaders) Object.assign(headers, extraHeaders);
		if (typeof data !== "string" && data?.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}

		let body: string | undefined = undefined;
		if (!["head", "get"].includes(method)) {
			if (typeof data === "object") body = JSON.stringify(data);
			else body = String(data);
		}

		headers["Content-Type"] = "application/json";

		return undici.fetch(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
			method: method.toUpperCase(),
			headers,
			body
		});
	}

	/**
	 * Execute a multipart/form-data request
	 * @param endpoint Endpoint to use
	 * @param params URL query parameters to add on to the URL
	 * @param method Http Method to use
	 * @param data data to send
	 * @returns Result of the request
	 */
	private async _multiPartRequest(endpoint: string, params: Record<string, any> = {}, method: HTTPMethod, data: FormData, extraHeaders?: Record<string, string>): Promise<IResponse> {
		const headers = { ...this.options.headers, ...data.getHeaders() };
		if (extraHeaders) Object.assign(headers, extraHeaders);

		return new Promise<IResponse>((res, rej) => {
			const line = pipeline([
				data,
				undici.pipeline(`${this.apiURL}${endpoint}${appendQuery(params)}`, {
					method: method.toUpperCase() as undici.Dispatcher.HttpMethod,
					headers
				}, d => {
					res(new PipelineHandlerResponse(d));
					return data;
				})
			], () => void 0);
			const onError = (e: any) => {
				line.removeListener("error", onError);
				data.destroy();
				rej(e);
			};
			line.once("error", onError);
		});
	}
}

interface IResponse {
	headers: undici.Headers;
	status: number;
	body: ReadableStream | null;

	json(): Promise<unknown>;
	text(): Promise<string>;
}

class PipelineHandlerResponse implements IResponse {
	public headers: undici.Headers;
	public status: number;
	public body: ReadableStream | null;

	public constructor(public backing: undici.Dispatcher.PipelineHandlerData) {
		this.headers = new undici.Headers(backing.headers as Record<string, string | ReadonlyArray<string>>);
		this.status = backing.statusCode;
		this.body = backing.body ? Readable.toWeb(backing.body) : null;
	}

	// undici.Dispatcher.PipelineHandlerData.body has type signatures for .json() and .text(), but they don't exist :angy:

	public async json(): Promise<unknown> {
		const str = await this.text();
		return JSON.parse(str);
	}

	public async text(): Promise<string> {
		if (!this.body) return "";
		const acc = new BufferAccumulator();

		for await (const chunk of this.body) {
			acc.add(Buffer.from(chunk));
		}

		return acc.concat()?.toString() ?? "";
	}
}

// BufferAccumulator taken from AmandaDiscord/Volcano#rewrite, which I am the owner of. Use for whatever - PapiOphidian

type AccumulatorNode = {
	chunk: Buffer;
	next: AccumulatorNode | null;
}

class BufferAccumulator {
	public first: AccumulatorNode | null = null;
	public last: AccumulatorNode | null = null;
	public size = 0;
	public expecting: number | null;

	private _allocated: Buffer | null = null;
	private _streamed: number | null = null;

	public constructor(expecting?: number) {
		if (expecting) {
			this._allocated = Buffer.allocUnsafe(expecting);
			this._streamed = 0;
		}
		this.expecting = expecting ?? null;
	}

	public add(buf: Buffer): void {
		if (this._allocated && this._streamed !== null && this.expecting !== null) {
			if (this._streamed === this.expecting) return;
			if ((this._streamed + buf.byteLength) > this.expecting) buf.subarray(0, this.expecting - this._streamed).copy(this._allocated, this._streamed);
			else buf.copy(this._allocated, this._streamed);
			return;
		}
		const obj = { chunk: buf, next: null };
		if (!this.first) this.first = obj;
		if (this.last) this.last.next = obj;
		this.last = obj;
		this.size += buf.byteLength;
	}

	public concat(): Buffer | null {
		if (this._allocated) return this._allocated;
		if (!this.first) return null;
		if (!this.first.next) return this.first.chunk;
		const r = Buffer.allocUnsafe(this.size);
		let written = 0;
		let current: AccumulatorNode | null = this.first;
		while (current) {
			current.chunk.copy(r, written);
			written += current.chunk.byteLength;
			current = current.next;
		}
		return r;
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
