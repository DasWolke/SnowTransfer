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

			if (v._errors) messages.push(`${newKey}: ${v._errors.map(e => e.message).join(" ")}`);
			else if (v.code || v.message) messages.push(`${v.code ? `${v.code}: ` : ""}${v.message}`.trim());
			else if (typeof v === "string") messages.push(v);
			else messages = messages.concat(this.flattenErrors(v, newKey));
		}

		return messages;
	}
}

interface HandlerEvents {
	request: [string, { endpoint: string, method: HTTPMethod, dataType: "json" | "multipart", data: any; }];
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
	public options: { baseHost: string; baseURL: string; headers: { Authorization?: string; "User-Agent": string; } };
	public latency: number;
	public apiURL: string;
	public static DiscordAPIErrror = DiscordAPIError;

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(ratelimiter: import("./Ratelimiter"), options: { token?: string; baseHost: string; }) {
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
	public request(endpoint: string, method: HTTPMethod, dataType: "json" | "multipart" = "json", data: any | undefined = {}): Promise<any> {
		if (typeof data === "number") data = String(data);
		const stack = new Error().stack;
		return new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				try {
					this.emit("request", reqID, { endpoint, method, dataType, data });

					let request: import("centra").Response;
					if (dataType == "json") request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")));
					else if (dataType == "multipart") request = await this._multiPartRequest(endpoint, method, data);
					else throw new Error("Forbidden dataType. Use json or multipart");

					if (request.statusCode && !Constants.OK_STATUS_CODES.includes(request.statusCode) && request.statusCode !== 429) throw new DiscordAPIError(endpoint, request.headers["content-type"]?.startsWith("application/json") ? await request.json() : request.body.toString(), method, request.statusCode);

					this._applyRatelimitHeaders(bkt, request.headers);

					if (request.statusCode === 429) {
						const b = JSON.parse(request.body.toString()); // Discord says it will be a JSON, so if there's an error, sucks
						if (b.global) this.ratelimiter.global = true;
						if (b.reset_after) bkt.reset = b.reset_after * 1000;
						bkt.runTimer();
						this.emit("rateLimit", { timeout: bkt.reset, limit: bkt.limit, method: method, path: endpoint, route: this.ratelimiter.routify(endpoint, method) });
						throw new DiscordAPIError(endpoint, b.message || "unknnown", method, request.statusCode);
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
					if (error && error.stack) error.stack = stack;
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
	private _applyRatelimitHeaders(bkt: import("./LocalBucket"), headers: any): void {
		if (headers["x-ratelimit-remaining"]) bkt.remaining = parseInt(headers["x-ratelimit-remaining"]);
		if (headers["x-ratelimit-limit"]) bkt.limit = parseInt(headers["x-ratelimit-limit"]);
		if (headers["x-ratelimit-reset"]) {
			bkt.reset = parseInt(headers["x-ratelimit-reset"]) - Date.now();
			bkt.runTimer();
		}
	}

	/**
	 * Execute a normal json request
	 * @param endpoint Endpoint to use
	 * @param data Data to send
	 * @param useParams Whether to send the data in the body or use query params
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, method: HTTPMethod, data?: any, useParams = false): Promise<import("centra").Response> {
		const headers = {};
		if (typeof data != "string" && data.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}
		const req = c(this.apiURL, method).path(endpoint).header({ ...this.options.headers, ...headers });
		if (useParams) return req.query(data).send();
		else {
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
	private async _multiPartRequest(endpoint: string, method: HTTPMethod, data: any): Promise<import("centra").Response> {
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
		const newHeaders = Object.assign({}, this.options.headers, form.getHeaders());

		return c(this.apiURL, method).path(endpoint).header(newHeaders).body(form.getBuffer()).timeout(15000).send();
	}
}

export = RequestHandler;
