import type { APIAllowedMentions } from "discord-api-types/v10";

import type { Readable } from "node:stream";

export type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

/**
 * A file that can be uploaded to Discord's API
 * @since 0.18.1
 */
export type SendableFile = Buffer | Blob | File | Readable | ReadableStream;

/**
 * A file to upload, or a factory that produces a fresh one each time the payload is materialized.
 *
 * Streams are single use: once a request has consumed them, sending the same payload again would upload nothing.
 * If you want to reuse a payload containing streams across calls, pass a factory that returns a new stream each time,
 * e.g. `file: () => fs.createReadStream(path)`. Buffers and Blobs are re-readable and don't need this.
 * @since 0.18.1
 */
export type FileInput = SendableFile | (() => SendableFile | Promise<SendableFile>);

export type SnowTransferOptions = {
	/** The URL to start requests from. eg: https://discord.com */
	baseHost: string;
	/** The base path of the base URL to use for the API. Defaults to /api/v${Constants.REST_API_VERSION} */
	baseURL: string;
	/** The fetch implementation to use when making requests. Defaults to globalThis.fetch */
	fetch: typeof globalThis.fetch;
	/** The default allowed_mentions object to send when creating/updating messages */
	allowed_mentions: APIAllowedMentions | undefined;
	/** If rate limit buckets should be totally bypassed and functions are executed as fast as possible. Only use if you are 100% certain you wont run into issues or if you are proxying */
	bypassBuckets: boolean;
	/** If failed requests that can be retried should be retried, up to retryLimit times. */
	retryRequests: boolean;
	/** How many times requests should be retried if they fail and can be retried. */
	retryLimit: number;
	/** How long in milliseconds a request may take in total before it is aborted. 0 disables the timeout. Defaults to 60000 */
	requestTimeout: number;
};

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

export type RequestEventData = {
	endpoint: string;
	method: string;
	dataType: "json" | "multipart";
	data: any;
}

export type HandlerEvents = {
	request: [string, RequestEventData];
	done: [string, Response, RequestEventData];
	requestError: [string, Error];
	rateLimit: [{ method: string; path: string; route: string; }];
}

export type SMState = {
	onEnter: Array<(event: string) => unknown>;
	onLeave: Array<(event: string) => unknown>;
	transitions: Map<string, SMTransition>;
}

export type SMTransition = {
	destination: string;
	onTransition?: Array<(...args: any[]) => unknown>;
}

export type SMHistory = {
	from: string;
	event: string;
	to: string;
	time: number;
}
