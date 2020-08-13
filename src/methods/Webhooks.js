const Endpoints = require("../Endpoints");

/**
 * Methods for handling webhook interactiong
 */
class WebhookMethods {
	/**
	 * Create a new Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.webhook.method`, where `client` is an initialized SnowTransfer instance
	 * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
	 * @param {Boolean} disableEveryone - Disable @everyone/@here on outgoing messages
	 */
	constructor(requestHandler, disableEveryone) {
		this.requestHandler = requestHandler;
		this.disableEveryone = disableEveryone;
	}

	/**
	 * Create a new Webhook
	 * @param {string} channelId - Id of the channel
	 * @param {object} data - Object with webhook properties
	 * @param {string} data.name - name of the webhook
	 * @param {string} [data.avatar] - base 64 encoded avatar
	 * @returns {Promise<object>} [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|-----------:|
	 | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Create a new Webhook with the name "Webby Webhook"
	 * let client = new SnowTransfer('TOKEN');
	 * let webhookData = {
	 *   name: "Webby Webhook"
	 * }
	 * client.webhook.createWebhook('channel Id', webhookData)
	 */
	async createWebhook(channelId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), "post", "json", null, data);
	}

	/**
	 * Get webhooks created within a channel
	 * @param {string} channelId - Id of the channel
	 * @returns {Promise<Object[]>} Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|-----------:|
	 | MANAGE_WEBHOOKS    | always    |
	 */
	async getWebhooksChannel(channelId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), "get", "json");
	}

	/**
	 * Get all webhooks within a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<object>} Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|-----------:|
	 | MANAGE_WEBHOOKS    | always    |
	 */
	async getWebhooksGuild(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_WEBHOOKS(guildId), "get", "json");
	}

	/**
	 * Get a single Webhook via Id
	 * @param {string} webhookId - Id of the webhook
	 * @param {string} [token] - Webhook token
	 * @returns {Promise<object>} [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|---------------:|
	 | MANAGE_WEBHOOKS    | without token |
	 */
	async getWebhook(webhookId, token) {
		if (token) {
			// @ts-ignore
			return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "get", "json");
		}
		// @ts-ignore
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "get", "json");
	}

	/**
	 * Update a webhook
	 * @param {string} webhookId - Id of the webhook
	 * @param {string} [token] - Webhook token
	 * @param {object} data - Updated Webhook properties
	 * @param {string} [data.name] - New default name of the webhook
	 * @param {string} [data.avatar] - Updated base 64 image for the default avatar
	 * @param {string} [data.channel_id] - Id of the new channel of the webhook
	 * @returns {Promise<object>} Updated [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|---------------:|
	 | MANAGE_WEBHOOKS    | without token |
	 */
	async updateWebhook(webhookId, token, data) {
		if (token) {
			// @ts-ignore
			return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "patch", "json", null, data);
		}
		// @ts-ignore
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "patch", "json", null, data);
	}

	/**
	 * Delete a Webhook
	 * @param {string} webhookId - Id of the webhook
	 * @param {string} [token] - Webhook token
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|---------------:|
	 | MANAGE_WEBHOOKS    | without token |
	 */
	async deleteWebhook(webhookId, token) {
		if (token) {
			// @ts-ignore
			return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "delete", "json");
		}
		// @ts-ignore
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "delete", "json");
	}

	/**
	 * Send a message via Webhook
	 * @param {string} webhookId - Id of the webhook
	 * @param {string} token - webhook token
	 * @param {object} data - Webhook data to send
	 * @param {string} [data.content] - content of the message
	 * @param {?string} [data.username] - username to use for the webhook
	 * @param {?string} [data.avatar_url] - avatar url of the webhook
	 * @param {?boolean} [data.tts] - send a text to speech message
	 * @param {object} [data.file] - File, that should be uploaded
	 * @param {string} [data.file.name] - Name of the file
	 * @param {File} [data.file.file] - Buffer with file contents
	 * @param {object[]} [data.embeds] - Array of [embed objects](https://discord.com/developers/docs/resources/channel#embed-object)
	 * @param {object} [options]
	 * @param {?boolean} [options.disableEveryone] - Disable @everyone/@here on the message
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 * @example
	 * // Send a message saying "Hi from my webhook" with a previously created webhook
	 * let client = new SnowTransfer('TOKEN');
	 * client.webhook.executeWebhook('webhook Id', 'webhook token', {content: 'Hi from my webhook'})
	 */
	async executeWebhook(webhookId, token, data, options = {}) {
		if (typeof data !== "string" && !data.content && !data.embeds && !data.file) {
			throw new Error("Missing content or embed");
		}
		if (typeof data === "string") {
			data = {content: data};
		}

		// Sanitize the message
		if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
			data.content = data.content.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere");
		}

		if (data.file) {
			// @ts-ignore
			return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "post", "multipart", null, data);
		} else {
			// @ts-ignore
			return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "post", "json", null, data);
		}
	}

	/**
	 * Execute a slack style Webhook
	 * @param {string} webhookId - Id of the Webhook
	 * @param {string} token - Webhook token
	 * @param {object} data - Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
	 * @param {object} [options]
	 * @param {?boolean} [options.disableEveryone] - Disable @everyone/@here on the message
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 */
	async executeWebhookSlack(webhookId, token, data, options = {}) {
		// Sanitize the message
		if (data.text && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
			data.text = data.text.replace(/@everyone/g, "@\u200beveryone").replace(/@here/g, "@\u200bhere");
		}

		// @ts-ignore
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token), "post", "json", data);
	}
}

module.exports = WebhookMethods;
