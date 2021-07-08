/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-async-promise-executor */

import { EventEmitter } from "events";
import crypto from "crypto";
import c from "centra";
import Endpoints from "./Endpoints";
import FormData from "form-data";

const { version } = require("../package.json");
import Constants from "./Constants";

type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

class DiscordAPIError extends Error {
	public method: HTTPMethod;
	public path: string;
	public code: number;
	public httpStatus: number;

	public constructor(path: string, error: any, method: HTTPMethod, status: number) {
		super();
		const flattened = DiscordAPIError.flattenErrors(error.errors || error).join("\n");
		this.name = "DiscordAPIError";
		this.message = error.message && flattened ? `${error.message}\n${flattened}` : error.message || flattened;
		this.method = method;
		this.path = path;
		this.code = error.code;
		this.httpStatus = status;
	}

	public static flattenErrors(obj: Record<string, any>, key = "") {
		let messages: Array<string> = [];

		for (const [k, v] of Object.entries(obj)) {
			if (k === "message") continue;
			const newKey = key ? (isNaN(Number(k)) ? `${key}.${k}` : `${key}[${k}]`) : k;

			if (v._errors) {
				messages.push(`${newKey}: ${v._errors.map(e => e.message).join(" ")}`);
			} else if (v.code || v.message) {
				messages.push(`${v.code ? `${v.code}: ` : ""}${v.message}`.trim());
			} else if (typeof v === "string") {
				messages.push(v);
			} else {
				messages = messages.concat(this.flattenErrors(v, newKey));
			}
		}

		return messages;
	}
}

interface HandlerEvents {
	request: [string, { endpoint: string, method: HTTPMethod, dataType: "json" | "multipart", data: any }];
	done: [string, c.Response];
	requestError: [string, Error];
	rateLimit: [{ timeout: number; limit: number; method: HTTPMethod; path: string; route: string; }];
}

interface RequestHandler {
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
class RequestHandler extends EventEmitter {
	public ratelimiter: import("./Ratelimiter");
	public options: { baseHost: string; baseURL: string; headers: { Authorization: string; "User-Agent": string; } };
	public latency: number;
	public apiURL: string;
	public static DiscordAPIErrror = DiscordAPIError;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(ratelimiter: import("./Ratelimiter"), options: { token: string; baseHost: string; }) {
		super();

		this.ratelimiter = ratelimiter;
		this.options = {
			baseHost: Endpoints.BASE_HOST,
			baseURL: Endpoints.BASE_URL,
			headers: {
				Authorization: options.token,
				"User-Agent": `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${version})`
			}
		};
		Object.assign(this.options, options);

		this.apiURL = this.options.baseHost + Endpoints.BASE_URL;
		this.latency = 500;
	}

	/**
	 * Request a route from the discord api
	 * @param endpoint endpoint to request
	 * @param method http method to use
	 * @param dataType type of the data being sent
	 * @param data data to send, if any
	 * @param amount amount of requests previously executed
	 * @returns Result of the request
	 */
	public request(endpoint: string, method: HTTPMethod, dataType: "json" | "multipart" = "json", data: any | undefined = {}, amount = 0): Promise<any> {
		if (typeof data === "number") data = String(data);
		const stack = new Error().stack;
		return new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				const latency = Date.now();
				try {
					this.emit("request", reqID, { endpoint, method, dataType, data });

					let request: import("centra").Response;
					if (dataType == "json") {
						request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")), amount);
					} else if (dataType == "multipart") {
						request = await this._multiPartRequest(endpoint, method, data, amount);
					} else {
						const e = new Error("Forbidden dataType. Use json or multipart");
						e.stack = stack;
						throw e;
					}

					// 429 and 502 are recoverable and will be re-tried automatically with 3 attempts max.
					if (request.statusCode && !Constants.OK_STATUS_CODES.includes(request.statusCode) && ![429, 502].includes(request.statusCode)) {
						const e = new DiscordAPIError(endpoint, request.headers["content-type"] === "application/json" ? await request.json() : request.body, method, request.statusCode);
						e.stack = stack;
						throw e;
					}

					if (request.headers["date"]) {
						this.latency = Date.now() - latency;
						const offsetDate = this._getOffsetDateFromHeader(request.headers["date"]);
						const match = endpoint.match(/\/reactions\//);
						this._applyRatelimitHeaders(bkt, request.headers, offsetDate, !!match);
					}

					if (request.statusCode && [429, 502].includes(request.statusCode)) {
						if (request.statusCode === 429) this.emit("rateLimit", { timeout: bkt.reset, limit: bkt.limit, method: method, path: endpoint, route: this.ratelimiter.routify(endpoint, method) });
						return this.request(endpoint, method, dataType, data, amount++);
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
					} else {
						return res(undefined);
					}
				} catch (error) {
					if (error && error.stack) error.stack = stack;
					this.emit("requestError", reqID, error);
					return rej(error);
				}
			}, endpoint, method);
		});
	}

	/**
	 * Calculate the time difference between the local server and discord
	 * @param dateHeader Date header value returned by discord
	 * @returns Offset in milliseconds
	 */
	private _getOffsetDateFromHeader(dateHeader: string): number {
		const discordDate = Date.parse(dateHeader);
		const offset = Date.now() - discordDate;
		return Date.now() + offset;
	}

	/**
	 * Apply the received ratelimit headers to the ratelimit bucket
	 * @param bkt Ratelimit bucket to apply the headers to
	 * @param headers Http headers received from discord
	 * @param offsetDate Unix timestamp of the current date + offset to discord time
	 * @param reactions Whether to use reaction ratelimits (1/250ms)
	 */
	private _applyRatelimitHeaders(bkt: import("./ratelimitBuckets/LocalBucket"), headers: any, offsetDate: number, reactions = false) {
		if (headers["x-ratelimit-global"]) {
			bkt.ratelimiter.global = true;
			bkt.ratelimiter.globalResetAt = Date.now() + (parseFloat(headers["retry_after"]) * 1000);
		}
		if (headers["x-ratelimit-reset"]) {
			const reset = (headers["x-ratelimit-reset"] * 1000) - offsetDate;
			if (reactions) {
				bkt.reset = Math.max(reset, 250);
			} else {
				bkt.reset = reset;
			}
		}
		if (headers["x-ratelimit-remaining"]) {
			bkt.remaining = parseInt(headers["x-ratelimit-remaining"]);
			if (bkt.remaining === 0) bkt.resetAt = Date.now() + bkt.reset;
		} else {
			bkt.remaining = 1;
		}
		if (headers["x-ratelimit-limit"]) {
			bkt.limit = parseInt(headers["x-ratelimit-limit"]);
		}
	}

	/**
	 * Execute a normal json request
	 * @param endpoint Endpoint to use
	 * @param data Data to send
	 * @param useParams Whether to send the data in the body or use query params
	 * @param amount amount of requests previously executed
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, method: HTTPMethod, data?: any, useParams = false, amount = 0): Promise<import("centra").Response> {
		if (amount >= 3) throw new Error("Max amount of rety attempts reached");
		const headers = {};
		if (typeof data != "string" && data.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}
		if (data.queryReason) {
			data.reason = data.queryReason;
			delete data.queryReason;
		}
		const req = c(this.apiURL, method).path(endpoint).header(this.options.headers);
		if (useParams) {
			return req.query(data).send();
		} else {
			if (data && typeof data === "object") req.body(data, "json");
			else if (data) req.body(data);
			return req.send();
		}
	}

	/**
	 * Execute a multipart/form-data request
	 * @param endpoint Endpoint to use
	 * @param method Http Method to use
	 * @param data data to send
	 * @returns Result of the request
	 */
	private async _multiPartRequest(endpoint: string, method: HTTPMethod, data: any, amount = 0): Promise<import("centra").Response> {
		if (amount >= 3) throw new Error("Max amount of rety attempts reached");
		const form = new FormData();
		if (data.files && Array.isArray(data.files) && data.files.every(f => !!f.name && !!f.file)) {
			for (const file of data.files) {
				form.append(file.name, file.file, file.name);
				delete file.file;
			}
		}
		form.append("payload_json", JSON.stringify(data));
		// duplicate headers in options as to not risk mutating the state.
		const newHeaders = Object.assign({}, this.options.headers, form.getHeaders());

		return c(this.apiURL, method).path(endpoint).header(newHeaders).body(form.getBuffer()).timeout(15000).send();
	}
}

export = RequestHandler;
