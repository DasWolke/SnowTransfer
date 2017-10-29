const Endpoints = require('../Endpoints');

class WebhookMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    async createWebhook(channelId, data) {
        return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), 'post', 'json', data);
    }

    async getWebhooksChannel(channelId) {
        return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), 'get', 'json');
    }

    async getWebhooksGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_WEBHOOKS(guildId), 'get', 'json');
    }

    async getWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'get', 'json');
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'get', 'json');
    }

    async updateWebhook(webhookId, token, data) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'patch', 'json', data);
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'patch', 'json', data);
    }

    async deleteWebhook(webhookId, token) {
        if (token) {
            return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), 'delete', 'json');
        }
        return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), 'delete', 'json');
    }

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

    async executeWebhookSlack(webhookId, token, data) {
        return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token), 'post', 'json', data);
    }
}

module.exports = WebhookMethods;