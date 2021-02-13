/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-async-promise-executor */

import { EventEmitter } from "events";
import crypto from "crypto";
import c from "centra";
import Endpoints from "./Endpoints";
import FormData from "form-data";

import { version } from "../package.json";

type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

/**
 * Request Handler class
 */
class RequestHandler extends EventEmitter {
	public ratelimiter: import("./Ratelimiter");
	public options: { baseHost: string; baseURL: string; headers: { Authorization: string; "User-Agent": string; } };
	public latency: number;
	public remaining: {};
	public reset: {};
	public limit: {};
	public apiURL: string;

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
		this.remaining = {};
		this.reset = {};
		this.limit = {};
	}

	/**
	 * Request a route from the discord api
	 * @param endpoint endpoint to request
	 * @param method http method to use
	 * @param dataType type of the data being sent
	 * @param data data to send, if any
	 * @returns Result of the request
	 * @fires RequestHandler.request#request
	 */
	public request(endpoint: string, method: HTTPMethod, dataType: "json" | "multipart" = "json", data: any | undefined = {}): Promise<any> {
		if (typeof data === "number") data = String(data);
		return new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				const latency = Date.now();
				try {
					/**
					 * @event RequestHandler#request
					 * @type {string}
					 */
					this.emit("request", reqID, { endpoint, method, dataType, data });

					let request: import("centra").Response;
					if (dataType == "json") {
						request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")));
					} else if (dataType == "multipart") {
						request = await this._multiPartRequest(endpoint, method, data);
					} else {
						throw new Error("Forbidden dataType. Use json or multipart");
					}
					this.latency = Date.now() - latency;
					const offsetDate = this._getOffsetDateFromHeader(request.headers["date"] as string);
					this._applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith("/reactions/:id"));

					this.emit("done", reqID, request);
					if (request.body) {
						let b: any;
						try {
							b = JSON.parse(request.body.toString());
						} catch {
							res();
						}
						return res(b);
					} else {
						return res();
					}
				} catch (error) {
					this.emit("requestError", reqID, error);
					if (error.response) {
						const offsetDate = this._getOffsetDateFromHeader(error.response.headers["date"]);
						if (error.response.status === 429) {
							//TODO WARN ABOUT THIS :< either bug or meme
							this._applyRatelimitHeaders(bkt, error.response.headers, offsetDate, endpoint.endsWith("/reactions/:id"));
							return this.request(endpoint, method, dataType, data);
						}
						if (error.response.status === 502) {
							return this.request(endpoint, method, dataType, data);
						}
					}
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
			bkt.ratelimiter.globalReset = parseInt(headers["retry_after"]);
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
	 * @returns Result of the request
	 */
	private async _request(endpoint: string, method: HTTPMethod, data?: any, useParams = false): Promise<import("centra").Response> {
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
	private async _multiPartRequest(endpoint: string, method: HTTPMethod, data: any): Promise<import("centra").Response> {
		const formData = new FormData();
		if (data.file.file) {
			if (data.file.name) {
				formData.append("file", data.file.file, { filename: data.file.name });
			} else {
				formData.append("file", data.file.file);
			}

			delete data.file.file;
		}
		formData.append("payload_json", JSON.stringify(data));
		// duplicate headers in options as to not mutate the state.
		const newHeaders = Object.assign(Object.create(null), this.options.headers);
		Object.assign(newHeaders, { "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}` });
		return c(this.apiURL, method).path(endpoint).header(newHeaders).body(formData, "form").send();
	}
}

export = RequestHandler;
