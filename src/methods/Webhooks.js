const Endpoints = require('../Endpoints');

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
     * @param {String} channelId - id of the channel
     * @param {Object} data
     * @param {String} [data.name] - name of the webhook
     * @param {String} [data.avatar] - base 64 encoded avatar
     * @returns {Promise.<Object>}
     */
    async createWebhook(channelId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), 'post', 'json', data);
    }

    /**
     * Get webhooks created within a channel
     * @param {String} channelId - id of the channel
     * @returns {Promise.<Object>}
     */
    async getWebhooksChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), 'get', 'json');
    }

    /**
     * Get all webhooks within a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>}
     */
    async getWebhooksGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_WEBHOOKS(guildId), 'get', 'json');
    }

    /**
     * Get a single webhook via id
     * @param {String} webhookId - id of the webhook
     * @param {String} [token] - webhook token
     * @returns {Promise.<Object>}
     */
    async getWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'get', 'json');
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'get', 'json');
    }

    /**
     * Update a webhook
     * @param {String} webhookId - id of the webhook
     * @param {String} [token] - webhook token
     * @param {Object} data - Webhook data to send
     * @param {String} [data.name] - default name of the webhook
     * @param {String} [data.avatar] - base 64 image of the default avatar
     * @param {String} [data.channel_id] - id of the new channel of the webhook
     * @returns {Promise.<Object>}
     */
    async updateWebhook(webhookId, token, data) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'patch', 'json', data);
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'patch', 'json', data);
    }

    /**
     * Delete a webhook
     * @param {String} webhookId - id of the webhook
     * @param {String} [token] - webhook token
     * @returns {Promise.<Object>}
     */
    async deleteWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'delete', 'json');
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'delete', 'json');
    }

    /**
     * Send a message via webhook
     * @param {String} webhookId - id of the webhook
     * @param {String} [token] - webhook token
     * @param {Object} data - webhook data to send
     * @param {String} [data.content] - content of the message
     * @param {?String} [data.username] - username to use for the webhook
     * @param {?String} [data.avatar_url] - avatar url of the webhook
     * @param {?Boolean} [data.tts] - send a text to speech message
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Buffer with file contents
     * @param {Object[]} [data.embeds] - Array of [embed objects](https://discordapp.com/developers/docs/resources/channel#embed-object)
     * @returns {Promise.<Object>}
     * @example
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.executeWebhook('webhook id', 'webhook token', {content: 'Hi from my webhook'})
     */
    async executeWebhook(webhookId, token, data) {
        if (typeof data !== 'string' && !data.content && !data.embed && !data.file) {
            throw new Error('Missing content or embed');
        }
        if (typeof data === 'string') {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'post', 'json', {content: data});
        } else if (data.file) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'post', 'multipart', data);
        } else {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'post', 'json', data);
        }
    }

    /**
     * Execute a slack style webhook
     * @param {String} webhookId - id of the webhook
     * @param {String} [token] - webhook token
     * @param {Object} data - Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
     * @returns {Promise.<Object>}
     */
    async executeWebhookSlack(webhookId, token, data) {
        return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token), 'post', 'json', data);
    }
}

module.exports = WebhookMethods;