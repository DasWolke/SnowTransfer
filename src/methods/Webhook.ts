import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import type { RequestHandler as RH } from "../RequestHandler";

import {
	type RESTDeleteAPIWebhookResult,
	type RESTDeleteAPIWebhookWithTokenMessageResult,
	type RESTGetAPIChannelWebhooksResult,
	type RESTGetAPIGuildWebhooksResult,
	type RESTGetAPIWebhookResult,
	type RESTGetAPIWebhookWithTokenMessageResult,
	type RESTPatchAPIWebhookJSONBody,
	type RESTPatchAPIWebhookResult,
	type RESTPatchAPIWebhookWithTokenJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageResult,
	type RESTPatchAPIWebhookWithTokenResult,
	type RESTPostAPIChannelWebhookJSONBody,
	type RESTPostAPIChannelWebhookResult,
	type RESTPostAPIWebhookWithTokenGitHubQuery,
	type RESTPostAPIWebhookWithTokenGitHubResult,
	type RESTPostAPIWebhookWithTokenGitHubWaitResult,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
	type RESTPostAPIWebhookWithTokenResult,
	type RESTPostAPIWebhookWithTokenSlackQuery,
	type RESTPostAPIWebhookWithTokenSlackResult,
	type RESTPostAPIWebhookWithTokenSlackWaitResult,
	type RESTPostAPIWebhookWithTokenWaitResult,

	MessageFlags
} from "discord-api-types/v10";

import type { Readable } from "stream";
import type { ReadableStream } from "stream/web";

/**
 * Methods for handling webhook interactions
 * @since 0.1.0
 */
class WebhookMethods {
	/**
	 * Create a new Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.webhook.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
	 */
	public constructor(public requestHandler: RH, public disableEveryone: boolean) {}

	/**
	 * Create a new Webhook
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param data Object with webhook properties
	 * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Create a new Webhook with the name "Webby Webhook"
	 * const client = new SnowTransfer("TOKEN")
	 * const webhookData = {
	 * 	name: "Webby Webhook"
	 * }
	 * const webhook = await client.webhook.createWebhook("channel Id", webhookData)
	 */
	public async createWebhook(channelId: string, data: RESTPostAPIChannelWebhookJSONBody): Promise<RESTPostAPIChannelWebhookResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), {}, "post", "json", data);
	}

	/**
	 * Get all webhooks within a channel
	 * @since 0.5.0
	 * @param channelId Id of the channel
	 * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Get all webhooks within a channel
	 * const client = new SnowTransfer("TOKEN")
	 * const webhooks = await client.webhook.getChannelWebhooks("channel Id")
	 */
	public async getChannelWebhooks(channelId: string): Promise<RESTGetAPIChannelWebhooksResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), {}, "get", "json");
	}

	/**
	 * Get all webhooks within a guild
	 * @since 0.5.0
	 * @param guildId Id of the guild
	 * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Get all webhooks within a guild
	 * const client = new SnowTransfer("TOKEN")
	 * const webhooks = await client.webhook.getGuildWebhooks("guild Id")
	 */
	public async getGuildWebhooks(guildId: string): Promise<RESTGetAPIGuildWebhooksResult> {
		return this.requestHandler.request(Endpoints.GUILD_WEBHOOKS(guildId), {}, "get", "json");
	}

	/**
	 * Get a single Webhook via Id
	 * @since 0.1.0
	 * @param webhookId Id of the webhook
	 * @param token Webhook token
	 * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 *
	 * @example
	 * // Get a webhook via Id providing a webhook token
	 * const client = new SnowTransfer() // No token needed if webhook token is provided
	 * const webhook = await client.webhook.getWebhook("webhook Id", "webhook token")
	 */
	public async getWebhook(webhookId: string, token?: string): Promise<RESTGetAPIWebhookResult> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), {}, "get", "json");
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), {}, "get", "json");
	}

	/**
	 * Update a webhook
	 * @since 0.1.0
	 * @param webhookId Id of the webhook
	 * @param data Updated Webhook properties
	 * @param token Webhook token
	 * @returns Updated [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 *
	 * @example
	 * // Rename a webhook to "Captain Hook" with a webhook token
	 * const client = new SnowTransfer(); // No token needed if webhook token is provided
	 * const webhookData = {
	 * 	name: "Captain Hook"
	 * }
	 * const webhook = await client.webhook.updateWebhook("webhook Id", webhookData, "webhook token")
	 */
	public async updateWebhook(webhookId: string, data: RESTPatchAPIWebhookWithTokenJSONBody & { reason?: string; }, token: string): Promise<RESTPatchAPIWebhookWithTokenResult>
	public async updateWebhook(webhookId: string, data: RESTPatchAPIWebhookJSONBody & { reason?: string; }): Promise<RESTPatchAPIWebhookResult>
	public async updateWebhook(webhookId: string, data: (RESTPatchAPIWebhookWithTokenJSONBody | RESTPatchAPIWebhookJSONBody) & { reason?: string; }, token?: string): Promise<RESTPatchAPIWebhookWithTokenResult | RESTPatchAPIWebhookResult> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), {}, "patch", "json", data);
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), {}, "patch", "json", data);
	}

	/**
	 * Delete a Webhook
	 * @since 0.1.0
	 * @param webhookId Id of the webhook
	 * @param token Webhook token
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 *
	 * @example
	 * // Delete a webhook via Id providing a webhook token
	 * const client = new SnowTransfer(); // No token needed if webhook token is provided
	 * client.webhook.deleteWebhook("webhook Id", "webhook token")
	 */
	public async deleteWebhook(webhookId: string, token?: string): Promise<RESTDeleteAPIWebhookResult> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), {}, "delete", "json") as RESTDeleteAPIWebhookResult;
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), {}, "delete", "json") as RESTDeleteAPIWebhookResult;
	}

	/**
	 * Send a message via Webhook
	 * @since 0.1.0
	 * @param webhookId Id of the webhook
	 * @param token webhook token
	 * @param data Webhook data to send
	 * @param options Options for executing the webhook
	 * @returns Resolves the Promise on successful execution unless wait is set to true, which returns a [message]() object
	 *
	 * @example
	 * // Send a message saying "Hi from my webhook" with a previously created webhook
	 * const client = new SnowTransfer()
	 * client.webhook.executeWebhook("webhook Id", "webhook token", { content: "Hi from my webhook" })
	 */
	public async executeWebhook(webhookId: string, token: string, data: RESTPostAPIWebhookWithTokenJSONBody & { files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }, options?: RESTPostAPIWebhookWithTokenQuery & { wait?: false, disableEveryone?: boolean; }): Promise<RESTPostAPIWebhookWithTokenResult>;
	public async executeWebhook(webhookId: string, token: string, data: RESTPostAPIWebhookWithTokenJSONBody & { files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }, options: RESTPostAPIWebhookWithTokenQuery & { wait: true, disableEveryone?: boolean; }): Promise<RESTPostAPIWebhookWithTokenWaitResult>;
	public async executeWebhook(webhookId: string, token: string, data: RESTPostAPIWebhookWithTokenJSONBody & { files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }, options?: RESTPostAPIWebhookWithTokenQuery & { disableEveryone?: boolean; }): Promise<RESTPostAPIWebhookWithTokenResult | RESTPostAPIWebhookWithTokenWaitResult> {
		if (typeof data !== "string" && !data.content && !data.embeds && !data.components && !data.files && !data.poll) throw new Error("Missing content, embeds, components, files, or poll");
		if (typeof data === "string") data = { content: data };

		const hasComponentsV2 = (!!data.flags && (data.flags & MessageFlags.IsComponentsV2) === MessageFlags.IsComponentsV2)

		if ((data.content || data.embeds) && data.flags && (hasComponentsV2)) throw new Error("The message flags was set to include IsComponentsV2, but content and/or embeds were also present. You can either have content/embeds or components v2, not both.");

		// Sanitize the message
		if (data.content && (options?.disableEveryone ?? this.disableEveryone)) data.content = Constants.replaceEveryone(data.content);
		if (data.components && (options?.disableEveryone ?? this.disableEveryone)) data.components = Constants.replaceEveryone(data.components);
		if (options) delete options.disableEveryone;

		if (data.files) return this.requestHandler.request(`${Endpoints.WEBHOOK_TOKEN(webhookId, token)}`, options, "post", "multipart", await Constants.standardMultipartHandler(data as Parameters<typeof Constants["standardMultipartHandler"]>["0"]));
		else return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), options, "post", "json", data);
	}

	/**
	 * Execute a slack style Webhook
	 * @since 0.1.0
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param data Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
	 * @param options Options for executing the webhook
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer() // No token needed
	 * client.webhook.executeSlackWebhook("webhook Id", "webhook token", slackdata)
	 */
	public async executeWebhookSlack(webhookId: string, token: string, data: any, options?: RESTPostAPIWebhookWithTokenSlackQuery & { wait?: false }): Promise<RESTPostAPIWebhookWithTokenSlackResult>
	public async executeWebhookSlack(webhookId: string, token: string, data: any, options?: RESTPostAPIWebhookWithTokenSlackQuery & { wait: true }): Promise<RESTPostAPIWebhookWithTokenSlackWaitResult>
	public async executeWebhookSlack(webhookId: string, token: string, data: any, options?: RESTPostAPIWebhookWithTokenSlackQuery): Promise<RESTPostAPIWebhookWithTokenSlackResult | RESTPostAPIWebhookWithTokenSlackWaitResult> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token), options, "post", "json", data);
	}

	/**
	 * Executes a github style Webhook
	 * @since 0.3.0
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param data Check [GitHub's documentation](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#webhook-payload-object)
	 * @param options Options for executing the webhook
	 * @returns Resolves the Promise on successful execution
	 */
	public async executeWebhookGitHub(webhookId: string, token: string, data: any, options?: RESTPostAPIWebhookWithTokenGitHubQuery & { wait?: false }): Promise<RESTPostAPIWebhookWithTokenGitHubResult>
	public async executeWebhookGitHub(webhookId: string, token: string, data: any, options?: RESTPostAPIWebhookWithTokenGitHubQuery & { wait: true }): Promise<RESTPostAPIWebhookWithTokenGitHubWaitResult>
	public async executeWebhookGitHub(webhookId: string, token: string, data: any, options: RESTPostAPIWebhookWithTokenGitHubQuery = {}): Promise<RESTPostAPIWebhookWithTokenGitHubResult | RESTPostAPIWebhookWithTokenGitHubWaitResult> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_GITHUB(webhookId, token), options, "post", "json", data);
	}

	/**
	 * Get a single message from a specific Webhook via Id
	 * @since 0.3.0
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @param threadId Id of the thread the message was sent in
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public async getWebhookMessage(webhookId: string, token: string, messageId: string, threadId?: string): Promise<RESTGetAPIWebhookWithTokenMessageResult> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), { thread_id: threadId }, "get", "json");
	}

	/**
	 * Edit a message sent by a Webhook
	 * @since 0.3.0
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @param data Data to send
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * @example
	 * const client = new SnowTransfer()
	 * const message = await client.webhook.editWebhookMessage("webhook Id", "webhook token", "message Id", { content: "New content" })
	 */
	public async editWebhookMessage(webhookId: string, token: string, messageId: string, data: RESTPatchAPIWebhookWithTokenMessageJSONBody & { thread_id?: string; files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }): Promise<RESTPatchAPIWebhookWithTokenMessageResult> {
		let threadId: string | undefined = undefined;
		if (data.thread_id) threadId = data.thread_id;
		delete data.thread_id;

		if (data.files) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), { thread_id: threadId }, "patch", "multipart", await Constants.standardMultipartHandler(data as Parameters<typeof Constants["standardMultipartHandler"]>["0"]));
		else return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), { thread_id: threadId }, "patch", "json", data);
	}

	/**
	 * Delete a message sent by a Webhook
	 * @since 0.3.0
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @param threadId Id of the thread the message was sent in
	 * @returns Resolves the Promise on successful execution
	 */
	public async deleteWebhookMessage(webhookId: string, token: string, messageId: string, threadId?: string): Promise<RESTDeleteAPIWebhookWithTokenMessageResult> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), { thread_id: threadId }, "delete", "json") as RESTDeleteAPIWebhookWithTokenMessageResult;
	}
}

export = WebhookMethods;
