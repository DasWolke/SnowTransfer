"use strict";

// Tests for the ratelimiter and request plumbing: the stateful, timing-dependent core
// where bugs hide until production. Nothing here asserts Discord data shapes - the mock
// fetch exists to script HTTP status/header sequences that cannot be reproduced on
// demand against the real API (retry chains, 429s, global limits).

const { test } = require("node:test");
const assert = require("node:assert/strict");

const { RequestHandler, Ratelimiter, DiscordAPIError, Bucket, LeakyCounter } = require("../dist/index.js");

/**
 * @param {number} status
 * @param {any} body
 * @param {Record<string, string>} [headers]
 */
function apiResponse(status, body, headers = {}) {
	return new Response(body === null ? null : JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json",
			"x-ratelimit-limit": "5",
			"x-ratelimit-remaining": "4",
			"x-ratelimit-reset-after": "0.05",
			...headers
		}
	});
}

/**
 * @param {(url: string, init: RequestInit | undefined, call: number) => Response | Promise<Response>} responder
 * @param {Partial<import("../dist/index.js").RequestHandlerOptions> & { token?: string }} [options]
 */
function makeHandler(responder, options = {}) {
	let calls = 0;
	/** @type {Array<{ url: string; init: RequestInit | undefined }>} */
	const requests = [];
	const handler = new RequestHandler(new Ratelimiter(), {
		token: "Bot test",
		fetch: async (url, init) => {
			calls++;
			requests.push({ url: String(url), init });
			return responder(String(url), init, calls);
		},
		...options
	});
	return { handler, requests, callCount: () => calls };
}

// ---------------------------------------------------------------------------
// Retry behavior. This path shipped broken in consecutive releases (infinite
// retries in <=0.17, bucket deadlock in 0.18.0) because nothing executed it.
// ---------------------------------------------------------------------------

test("retryFailed retries a failed request and does not deadlock the bucket", async () => {
	const { handler, callCount } = makeHandler(
		(url, init, call) => call < 3 ? apiResponse(500, { message: "oops" }) : apiResponse(200, { ok: true }),
		{ retryFailed: true, retryLimit: 3 }
	);

	const result = await handler.request("/channels/123/messages", {}, "get", "json");
	assert.deepEqual(result, { ok: true });
	assert.equal(callCount(), 3);

	// The regression that motivated this test: the bucket must still process
	// requests on the same route after a retry chain has completed
	const again = await handler.request("/channels/123/messages", {}, "get", "json");
	assert.deepEqual(again, { ok: true });
	assert.equal(callCount(), 4);
});

test("retryFailed gives up after retryLimit and rejects with a DiscordAPIError", async () => {
	const { handler, callCount } = makeHandler(
		() => apiResponse(500, { message: "oops" }),
		{ retryFailed: true, retryLimit: 2 }
	);

	await assert.rejects(
		handler.request("/channels/123/messages", {}, "get", "json"),
		err => err instanceof DiscordAPIError && err.httpStatus === 500
	);
	assert.equal(callCount(), 3); // initial request + 2 retries
});

test("rawResponse is preserved across retries", async () => {
	const { handler } = makeHandler(
		(url, init, call) => call < 2 ? apiResponse(500, { message: "oops" }) : apiResponse(200, { ok: true }),
		{ retryFailed: true, retryLimit: 3 }
	);

	const result = await handler.request("/invites/abc/target-users", {}, "get", "json", undefined, undefined, 3, true);
	assert.ok(result instanceof Response, "expected the raw Response object after a retry");
});

test("a request that fails without a response doesn't deadlock the bucket", { timeout: 2000 }, async () => {
	const { handler, callCount } = makeHandler((url, init, call) => {
		if (call === 1) throw new TypeError("fetch failed");
		return apiResponse(200, { ok: true });
	});

	await assert.rejects(handler.request("/channels/123/messages", {}, "get", "json"), TypeError);
	// No headers ever came back to refill the counter, so this used to hang forever with the bucket always in cooldown
	const again = await handler.request("/channels/123/messages", {}, "get", "json");
	assert.deepEqual(again, { ok: true });
	assert.equal(callCount(), 2);
});

test("a 429 is retried after the bucket cooldown when retryFailed is set", async () => {
	const { handler, callCount } = makeHandler(
		(url, init, call) => call === 1
			? apiResponse(429, { message: "You are being rate limited.", retry_after: 0.05, global: false }, { "x-ratelimit-remaining": "0" })
			: apiResponse(200, { ok: true }),
		{ retryFailed: true, retryLimit: 3 }
	);

	const before = Date.now();
	const result = await handler.request("/channels/123/messages", {}, "get", "json");
	const elapsed = Date.now() - before;

	assert.deepEqual(result, { ok: true });
	assert.equal(callCount(), 2);
	assert.ok(elapsed >= 40, `retry should have waited for the ratelimit reset, only waited ${elapsed}ms`);
});

test("a 400 is not retried even with retryFailed", async () => {
	const { handler, callCount } = makeHandler(
		() => apiResponse(400, { message: "Invalid Form Body", code: 50035 }),
		{ retryFailed: true, retryLimit: 3 }
	);

	await assert.rejects(handler.request("/channels/123/messages", {}, "post", "json", { content: "" }));
	assert.equal(callCount(), 1);
});

// ---------------------------------------------------------------------------
// Ratelimit bookkeeping
// ---------------------------------------------------------------------------

test("a global 429 blocks requests to other routes until it expires", async () => {
	const { handler, callCount } = makeHandler(
		(url, init, call) => call === 1
			? apiResponse(429, { message: "You are being rate limited.", retry_after: 0.06, global: true })
			: apiResponse(200, { ok: true })
	);

	await assert.rejects(handler.request("/channels/111/messages", {}, "get", "json"));

	// A different route shares the global counter and must wait out the penalty
	const before = Date.now();
	await handler.request("/channels/222/messages", {}, "get", "json");
	const elapsed = Date.now() - before;

	assert.equal(callCount(), 2);
	assert.ok(elapsed >= 45, `second route should have waited for the global reset, only waited ${elapsed}ms`);
});

test("cooldown only waits for exhausted counters, not the global counter's full window", async () => {
	const { handler, callCount } = makeHandler(
		() => apiResponse(200, { ok: true }, { "x-ratelimit-remaining": "0", "x-ratelimit-reset-after": "0.03" })
	);

	const before = Date.now();
	await handler.request("/channels/123/messages", {}, "get", "json");
	await handler.request("/channels/123/messages", {}, "get", "json");
	const elapsed = Date.now() - before;

	assert.equal(callCount(), 2);
	// The route counter resets after 30ms; before the fix this waited on the global counter's ~1s window
	assert.ok(elapsed < 500, `second request should run shortly after the 30ms reset, took ${elapsed}ms`);
});

test("requests with ratelimit budget remaining run back to back without artificial delay", async () => {
	const { handler, callCount } = makeHandler(() => apiResponse(200, { ok: true }));

	const before = Date.now();
	await handler.request("/channels/123/messages", {}, "get", "json");
	await handler.request("/channels/123/messages", {}, "get", "json");
	await handler.request("/channels/123/messages", {}, "get", "json");
	const elapsed = Date.now() - before;

	assert.equal(callCount(), 3);
	assert.ok(elapsed < 200, `three requests with remaining=4 should not wait on cooldowns, took ${elapsed}ms`);
});

// ---------------------------------------------------------------------------
// Route key derivation. Pure regex logic - the exact kind of code that breaks
// silently when a pattern is adjusted. Wrong keys mean wrong bucket sharing:
// either needless throttling or 429 storms.
// ---------------------------------------------------------------------------

test("routify produces the documented route keys", () => {
	const rl = new Ratelimiter();

	// Minor ids are collapsed, channel/guild/webhook ids are kept
	assert.equal(rl.routify("/channels/123/messages/456", "GET"), "/channels/123/messages/:id");
	assert.equal(rl.routify("/guilds/123/members/456", "GET"), "/guilds/123/members/:id");

	// DELETE message gets its own bucket (different server-side limit than send/edit)
	assert.equal(rl.routify("/channels/123/messages/456", "DELETE"), "DELETE/channels/123/messages/:id");

	// All reaction mutations share one MODIFY bucket regardless of emoji/user
	assert.equal(rl.routify("/channels/123/messages/456/reactions/%F0%9F%98%80/@me", "PUT"), "MODIFY/channels/123/messages/:id/reactions");
	assert.equal(rl.routify("/channels/123/messages/456/reactions/name%3A123456/@me", "DELETE"), "MODIFY/channels/123/messages/:id/reactions");

	// Webhook tokens are collapsed so one webhook = one bucket
	const token = "a".repeat(68);
	assert.equal(rl.routify(`/webhooks/123/${token}`, "POST"), "/webhooks/123/:token");

	// Guild channel list GET is special-cased
	assert.equal(rl.routify("/guilds/123/channels", "GET"), "/guilds/:id/channels");
});

test("requests to the same route share a bucket, different routes do not", async () => {
	const { handler } = makeHandler(() => apiResponse(200, {}));
	await handler.request("/channels/1/messages/2", {}, "get", "json");
	await handler.request("/channels/1/messages/3", {}, "get", "json");
	await handler.request("/channels/9/messages/2", {}, "get", "json");

	const keys = Array.from(handler.ratelimiter.buckets.keys());
	assert.deepEqual(keys.toSorted((a, b) => a.localeCompare(b)), ["/channels/1/messages/:id", "/channels/9/messages/:id"]);
});

// ---------------------------------------------------------------------------
// Request construction
// ---------------------------------------------------------------------------

test("no body or Content-Type is sent when there is no data", async () => {
	const { handler, requests } = makeHandler(() => apiResponse(204, null));

	await handler.request("/channels/1/messages/2/crosspost", {}, "post", "json");
	assert.equal(requests[0].init?.body, undefined);
	// @ts-expect-error TS is weird with undici
	assert.equal(requests[0].init?.headers?.["Content-Type"], undefined);

	await handler.request("/channels/1/messages", {}, "post", "json", { content: "hi" });
	assert.equal(requests[1].init?.body, JSON.stringify({ content: "hi" }));
	// @ts-expect-error TS is weird with undici
	assert.equal(requests[1].init?.headers?.["Content-Type"], "application/json");
});

test("the baseURL option is used when building request URLs", async () => {
	const { handler, requests } = makeHandler(() => apiResponse(200, {}), {
		baseHost: "https://my-proxy.example",
		baseURL: "/custom/v10"
	});

	assert.equal(handler.apiURL, "https://my-proxy.example/custom/v10");
	await handler.request("/gateway", {}, "get", "json");
	assert.equal(requests[0].url, "https://my-proxy.example/custom/v10/gateway");
});

test("query params are appended without mutating the caller's object", async () => {
	const { handler, requests } = makeHandler(() => apiResponse(200, []));

	const params = { limit: 50, after: undefined };
	await handler.request("/channels/123/messages", params, "get", "json");

	assert.equal(requests[0].url, "https://discord.com/api/v10/channels/123/messages?limit=50");
	assert.ok(Object.keys(params).includes("after"), "caller's params object should not be mutated");
});

test("DiscordAPIError exposes the Discord error code and message from JSON bodies", async () => {
	const { handler } = makeHandler(() => apiResponse(404, { message: "Unknown Message", code: 10008 }));

	await assert.rejects(
		handler.request("/channels/123/messages/456", {}, "get", "json"),
		err => {
			assert.ok(err instanceof DiscordAPIError);
			assert.equal(err.code, 10008);
			assert.equal(err.httpStatus, 404);
			assert.equal(err.message, "Unknown Message");
			return true;
		}
	);
});

// ---------------------------------------------------------------------------
// Bucket pause/resume - public API used by CloudStorm-style consumers
// ---------------------------------------------------------------------------

test("a paused bucket holds queued calls and resume releases them", async () => {
	const bucket = new Bucket([new LeakyCounter(5)]);
	bucket.pause();

	let ran = false;
	const done = bucket.enqueue(async () => {
		ran = true;
		return "value";
	});

	await new Promise(res => setTimeout(res, 30));
	assert.equal(ran, false, "paused bucket must not consume queued calls");

	bucket.resume();
	assert.equal(await done, "value");
	assert.equal(ran, true);
});
