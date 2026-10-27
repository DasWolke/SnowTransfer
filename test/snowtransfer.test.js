"use strict";

// Tests for behavior the library adds on top of Discord's API: option plumbing,
// request transformations, client-side validation, and pure functions.
// Deliberately absent: any test that a wrapper method returns the data the mock
// fed it - those only test the mock.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { Readable } = require("node:stream");

const { SnowTransfer, Constants } = require("../dist/index.js");

const { AllowedMentionsTypes, MessageFlags } = require("discord-api-types/v10");

/** Creates a client whose fetch records requests and returns 200 {} */
function makeClient(options = {}) {
	/** @type {Array<{ url: string; init: RequestInit | undefined }>} */
	const requests = [];
	const client = new SnowTransfer("TOKEN", {
		fetch: async (url, init) => {
			requests.push({ url: String(url), init });
			return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
		},
		...options
	});
	return { client, requests };
}

/**
 * Builds a Discord snowflake for a given unix timestamp in ms
 * @param {number} timestampMs
 */
function snowflakeAt(timestampMs) {
	return (BigInt(timestampMs - 1420070400000) << BigInt(22)).toString();
}

// ---------------------------------------------------------------------------
// Option plumbing
// ---------------------------------------------------------------------------

test("bare tokens get the Bot prefix, existing prefixes are kept", () => {
	assert.equal(new SnowTransfer("abc123").token, "Bot abc123");
	assert.equal(new SnowTransfer("Bot abc123").token, "Bot abc123");
	assert.equal(new SnowTransfer("Bearer abc123").token, "Bearer abc123");
	// A raw token that merely starts with the letters "Bot" still gets prefixed
	assert.equal(new SnowTransfer("Botlike-token").token, "Bot Botlike-token");
});

test("custom fetch and baseURL are passed through to the RequestHandler", async () => {
	const { client, requests } = makeClient({ baseHost: "https://my-proxy.example", baseURL: "/custom/v10" });

	await client.user.getSelf();
	assert.equal(requests[0].url, "https://my-proxy.example/custom/v10/users/@me");
});

test("the default allowed_mentions is applied to messages unless overridden", async () => {
	const { client, requests } = makeClient({ allowed_mentions: { parse: [] } });

	await client.channel.createMessage("123", "hi");
	assert.deepEqual(JSON.parse(requests[0].init?.body?.toString() ?? "{}").allowed_mentions, { parse: [] });

	await client.channel.createMessage("123", { content: "hi", allowed_mentions: { parse: [AllowedMentionsTypes.User] } });
	assert.deepEqual(JSON.parse(requests[1].init?.body?.toString() ?? "{}").allowed_mentions, { parse: [AllowedMentionsTypes.User] });
});

// ---------------------------------------------------------------------------
// Request transformations
// ---------------------------------------------------------------------------

test("editWebhookMessage moves thread_id out of the body and into the query string", async () => {
	const { client, requests } = makeClient();

	await client.webhook.editWebhookMessage("hookId", "hookToken", "messageId", { content: "new", thread_id: "999" });

	assert.ok(requests[0].url.endsWith("?thread_id=999"), `thread_id missing from query: ${requests[0].url}`);
	const body = JSON.parse(requests[0].init?.body?.toString() ?? "{}");
	assert.equal(body.content, "new");
	assert.ok(!("thread_id" in body), "thread_id must not be sent in the JSON body");
});

test("createMessage does not mutate the caller's data object", async () => {
	const { client } = makeClient({ allowed_mentions: { parse: [] } });

	const data = { content: "hi" };
	await client.channel.createMessage("123", data);
	assert.deepEqual(data, { content: "hi" }, "allowed_mentions default must not be written into caller's object");
});

test("standardMultipartHandler builds payload_json without consuming the caller's file buffers", async () => {
	const data = { content: "hi", files: [{ name: "a.png", file: Buffer.from("imagebytes") }] };
	const form = await Constants.standardMultipartHandler(data);

	assert.ok(form.get("files[0]") instanceof Blob, "file should be appended as a form part");
	const payload = JSON.parse(form.get("payload_json")?.toString() ?? "{}");
	assert.equal(payload.content, "hi");
	assert.equal(payload.files?.[0]?.file, undefined, "raw file bytes must not leak into payload_json");

	// The caller's object must be intact for retries or reuse
	assert.ok(Buffer.isBuffer(data.files[0].file), "caller's file buffer must not be deleted");
});

test("file factories are invoked per materialization, letting payloads with streams be reused", async () => {
	let calls = 0;
	const data = { content: "hi", files: [{ name: "a.txt", file: () => Readable.from([`stream ${++calls}`]) }] };

	const form1 = await Constants.standardMultipartHandler(data);
	const form2 = await Constants.standardMultipartHandler(data);

	assert.equal(calls, 2, "the factory must be called once per materialization");
	const part1 = form1.get("files[0]");
	const part2 = form2.get("files[0]");
	assert.ok(part1 instanceof Blob && part2 instanceof Blob, "factory results should be materialized into form parts");
	assert.equal(await part1.text(), "stream 1", "each materialization must consume a fresh stream");
	assert.equal(await part2.text(), "stream 2", "each materialization must consume a fresh stream");
});

test("path params are encoded exactly once, pre-encoded input still works, and dot segments are rejected", async () => {
	const { client, requests } = makeClient();

	await client.channel.createReaction("1", "2", "😀");
	await client.channel.createReaction("1", "2", encodeURIComponent("😀"));
	assert.equal(requests[0].url, "https://discord.com/api/v10/channels/1/messages/2/reactions/%F0%9F%98%80/@me");
	assert.equal(requests[1].url, requests[0].url);

	await assert.rejects(client.guild.deleteGuildMemberRole("1", "..", "2"));
	await assert.rejects(client.guild.deleteGuildMemberRole("1", "%2E%2E", "2"));
	// Discord decodes %2F into a real slash (since we encode path segments), so this kick would turn into removing role 456 from member 123
	await assert.rejects(client.guild.deleteGuildMember("1", "123/roles/456"));
	await assert.rejects(client.guild.deleteGuildMember("1", "123%2Froles%2F456"));
	assert.equal(requests.length, 2);
});

test("audit log reasons are URL encoded so non latin1 text doesn't make fetch throw", async () => {
	const { client, requests } = makeClient();
	await client.guild.createGuildBan("1", "2", {}, "スパム 100%");
	assert.equal(new Headers(requests[0].init?.headers).get("X-Audit-Log-Reason"), "%E3%82%B9%E3%83%91%E3%83%A0%20100%25");
});

// ---------------------------------------------------------------------------
// Client-side validation (throws before any network call)
// ---------------------------------------------------------------------------

test("createMessage rejects empty messages and content+ComponentsV2 conflicts locally", async () => {
	const { client, requests } = makeClient();

	await assert.rejects(client.channel.createMessage("123", {}), /Missing content/);
	await assert.rejects(
		client.channel.createMessage("123", { content: "hi", flags: MessageFlags.IsComponentsV2 }),
		/IsComponentsV2/
	);
	assert.equal(requests.length, 0, "validation failures must not hit the network");
});

test("deleteMessages validates count and the two week age limit locally", async () => {
	const { client, requests } = makeClient();
	const fresh = snowflakeAt(Date.now() - 60_000);
	const stale = snowflakeAt(Date.now() - 15 * 24 * 60 * 60 * 1000);

	await assert.rejects(client.channel.deleteMessages("123", [fresh]), RangeError);
	await assert.rejects(client.channel.deleteMessages("123", [fresh, stale]), /older than 2 weeks/);
	assert.equal(requests.length, 0);
});

test("getChannelMessages rejects limits outside 1-100 locally", async () => {
	const { client, requests } = makeClient();

	await assert.rejects(client.channel.getChannelMessages("123", { limit: 101 }), RangeError);
	await assert.rejects(client.channel.getChannelMessages("123", { limit: 0 }), RangeError);
	assert.equal(requests.length, 0);
});

// ---------------------------------------------------------------------------
// Pure functions
// ---------------------------------------------------------------------------

test("cloneUserInput deep clones plain data but shares exotic references", () => {
	const file = Buffer.from("imagebytes");
	const stream = Readable.from(["chunk"]);
	const input = {
		content: "hi",
		embeds: [{ fields: [{ name: "a", value: "b" }] }],
		files: [{ name: "a.png", file }],
		stream
	};
	const cloned = Constants.cloneUserInput(input);

	// Everything plain gets a new identity at every depth, so writes to the clone can't reach the caller
	assert.notEqual(cloned, input);
	assert.notEqual(cloned.embeds, input.embeds);
	assert.notEqual(cloned.embeds[0].fields[0], input.embeds[0].fields[0]);
	assert.notEqual(cloned.files[0], input.files[0]);

	// Exotic values pass through by reference - copying them is wasteful (Buffer) or impossible (streams)
	assert.equal(cloned.files[0].file, file, "Buffers must be shared by reference");
	assert.equal(cloned.stream, stream, "streams must be shared by reference");

	assert.deepEqual(cloned, input, "clone must be structurally identical to the input");
});

test("generateWaveform produces one byte per time slice, capped at 256 points", () => {
	// 10 seconds sampled at most 10x per second -> 100 points
	const fullScale = Constants.generateWaveform(new Array(48000).fill(32767), 10);
	const decoded = Buffer.from(fullScale, "base64");
	assert.equal(decoded.length, 100);
	assert.ok(decoded.every(b => b === 255), "full-scale input should produce max amplitude");

	const silence = Buffer.from(Constants.generateWaveform(new Array(48000).fill(0), 10), "base64");
	assert.ok(silence.every(b => b === 0), "silence should produce zero amplitude");

	// Long durations cap at 256 datapoints (Discord's documented maximum)
	const capped = Buffer.from(Constants.generateWaveform(new Array(48000).fill(1000), 600), "base64");
	assert.equal(capped.length, 256);
});
