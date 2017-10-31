const Endpoints = require('../Endpoints');

/**
 * Methods for handling webhook interactiong
 */
class WebhookMethods {
    /**
     * Create a new Method Handler
     * @param {RequestHandler} requestHandler
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Create a new Webhook
     * @param {String} channelId - id of the channel
     * @param data
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
     * @param data
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
     * @param data
     * @returns {Promise.<Object>}
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
     * @param data
     * @returns {Promise.<Object>}
     */
    async executeWebhookSlack(webhookId, token, data) {
        return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token), 'post', 'json', data);
    }
}

module.exports = WebhookMethods;