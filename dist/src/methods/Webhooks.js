"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Endpoints_1 = require("../Endpoints");
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
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    /**
     * Create a new Webhook
     * @param {String} channelId - Id of the channel
     * @param {Object} data - Object with webhook properties
     * @param {String} data.name - name of the webhook
     * @param {String} [data.avatar] - base 64 encoded avatar
     * @returns {Promise.<Object>} [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
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
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_WEBHOOKS(channelId), 'post', 'json', data);
    }
    /**
     * Get webhooks created within a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object[]>} Array of [Webhook Objects](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_WEBHOOKS    | always    |
     */
    async getWebhooksChannel(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_WEBHOOKS(channelId), 'get', 'json');
    }
    /**
     * Get all webhooks within a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Object>} Array of [Webhook Objects](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_WEBHOOKS    | always    |
     */
    async getWebhooksGuild(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_WEBHOOKS(guildId), 'get', 'json');
    }
    /**
     * Get a single Webhook via Id
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @returns {Promise.<Object>} [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    async getWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'get', 'json');
        }
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), 'get', 'json');
    }
    /**
     * Update a webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @param {Object} data - Updated Webhook properties
     * @param {String} [data.name] - New default name of the webhook
     * @param {String} [data.avatar] - Updated base 64 image for the default avatar
     * @param {String} [data.channel_id] - Id of the new channel of the webhook
     * @returns {Promise.<Object>} Updated [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    async updateWebhook(webhookId, token, data) {
        if (token) {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'patch', 'json', data);
        }
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), 'patch', 'json', data);
    }
    /**
     * Delete a Webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    async deleteWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'delete', 'json');
        }
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), 'delete', 'json');
    }
    /**
     * Send a message via Webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} token - webhook token
     * @param {Object} data - Webhook data to send
     * @param {String} [data.content] - content of the message
     * @param {?String} [data.username] - username to use for the webhook
     * @param {?String} [data.avatar_url] - avatar url of the webhook
     * @param {?Boolean} [data.tts] - send a text to speech message
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Buffer with file contents
     * @param {Object[]} [data.embeds] - Array of [embed objects](https://discordapp.com/developers/docs/resources/channel#embed-object)
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     * @example
     * // Send a message saying "Hi from my webhook" with a previously created webhook
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.executeWebhook('webhook Id', 'webhook token', {content: 'Hi from my webhook'})
     */
    async executeWebhook(webhookId, token, data) {
        if (typeof data !== 'string' && !data.content && !data.embeds && !data.file) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'post', 'json', { content: data });
        }
        else if (data.file) {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'post', 'multipart', data);
        }
        else {
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), 'post', 'json', data);
        }
    }
    /**
     * Execute a slack style Webhook
     * @param {String} webhookId - Id of the Webhook
     * @param {String} token - Webhook token
     * @param {Object} data - Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
     * @returns {Promise<void>} Resolves the Promise on successful execution
     */
    async executeWebhookSlack(webhookId, token, data) {
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN_SLACK(webhookId, token), 'post', 'json', data);
    }
}
exports.default = WebhookMethods;
//# sourceMappingURL=Webhooks.js.map