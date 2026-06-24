import type { APIAllowedMentions } from "discord-api-types/v10";

export type HTTPMethod = "get" | "post" | "patch" | "head" | "put" | "delete" | "connect" | "options" | "trace";

export type SnowTransferOptions = {
	/** The URL to start requests from. eg: https://discord.com */
	baseHost: string;
	/** The default allowed_mentions object to send when creating/updating messages */
	allowed_mentions: APIAllowedMentions | undefined;
	/** If rate limit buckets should be totally bypassed and functions are executed as fast as possible. Only use if you are 100% certain you wont run into issues or if you are proxying */
	bypassBuckets: boolean;
	/** If failed requests that can be retried should be retried, up to retryLimit times. */
	retryRequests: boolean;
	/** How many times requests should be retried if they fail and can be retried. */
	retryLimit: number;
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
