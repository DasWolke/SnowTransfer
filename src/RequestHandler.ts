/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-async-promise-executor */

import { EventEmitter } from "events";
import crypto from "crypto";
import http from "http";
import https from "https";
import axios from "axios";
import Endpoints from "./Endpoints";
import FormData from "form-data";

import { version } from "../package.json";

/**
 * Request Handler class
 */
class RequestHandler extends EventEmitter {
	public ratelimiter: import("./Ratelimiter");
	public options: { baseHost: string; baseURL: string; };
	public client: import("axios").AxiosInstance;
	public latency: number;
	public remaining: {};
	public reset: {};
	public limit: {};

	/**
	 * Create a new request handler
	 * @param ratelimiter ratelimiter to use for ratelimiting requests
	 * @param options options
	 */
	public constructor(ratelimiter: import("./Ratelimiter"), options: { token: string; baseHost: string; }) {
		super();

		this.ratelimiter = ratelimiter;
		this.options = {baseHost: Endpoints.BASE_HOST, baseURL: Endpoints.BASE_URL};
		Object.assign(this.options, options);
		this.client = axios.create({
			baseURL: this.options.baseHost + Endpoints.BASE_URL,
			headers: {
				Authorization: options.token,
				"User-Agent": `DiscordBot (https://github.com/DasWolke/SnowTransfer, ${version})`
			},
			httpAgent: new http.Agent({ keepAlive: true }),
			httpsAgent: new https.Agent({ keepAlive: true })
		});
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
	public request(endpoint: string, method: import("axios").Method, dataType: "json" | "multipart" = "json", data: any | undefined = {}): Promise<any> {
		if (typeof data === "number") data = String(data);
		const promise = new Promise(async (res, rej) => {
			this.ratelimiter.queue(async (bkt) => {
				const reqID = crypto.randomBytes(20).toString("hex");
				const latency = Date.now();
				try {
					/**
					 * @event RequestHandler#request
					 * @type {string}
					 */
					this.emit("request", reqID, { endpoint, method, dataType, data });

					let request: any;
					if (dataType == "json") {
						request = await this._request(endpoint, method, data, (method === "get" || endpoint.includes("/bans") || endpoint.includes("/prune")));
					} else if (dataType == "multipart") {
						request = await this._multiPartRequest(endpoint, method, data);
					}
					this.latency = Date.now() - latency;
					const offsetDate = this._getOffsetDateFromHeader(request.headers["date"]);
					this._applyRatelimitHeaders(bkt, request.headers, offsetDate, endpoint.endsWith("/reactions/:id"));

					this.emit("done", reqID, request);
					if (request.data) {
						return res(request.data);
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
		return promise;
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
	private async _request(endpoint: string, method: import("axios").Method, data?: any, useParams = false): Promise<any> {
		const headers = {};
		if (typeof data != "string" && data.reason) {
			headers["X-Audit-Log-Reason"] = encodeURIComponent(data.reason);
			delete data.reason;
		}
		if (data.queryReason) {
			data.reason = data.queryReason;
			delete data.queryReason;
		}
		if (useParams) {
			return this.client({url: endpoint, method, params: data, headers});
		} else {
			return this.client({url: endpoint, method, data, headers});
		}
	}

	/**
	 * Execute a multipart/form-data request
	 * @param endpoint Endpoint to use
	 * @param method Http Method to use
	 * @param data data to send
	 * @returns Result of the request
	 */
	private async _multiPartRequest(endpoint: string, method: import("axios").Method, data: any): Promise<any> {
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
		// :< axios is mean sometimes
		return this.client({
			url: endpoint,
			method,
			data: formData,
			headers: {"Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`}
		});
	}
}

export = RequestHandler;
