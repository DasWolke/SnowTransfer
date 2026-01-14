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

export type RequestEventData = {
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
