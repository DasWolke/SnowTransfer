"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class WebhookMethods {
    constructor(requestHandler, disableEveryone) {
        this.requestHandler = requestHandler;
        this.disableEveryone = disableEveryone;
    }
    async createWebhook(channelId, data) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_WEBHOOKS(channelId), "post", "json", data);
    }
    async getWebhooksChannel(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_WEBHOOKS(channelId), "get", "json");
    }
    async getWebhooksGuild(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_WEBHOOKS(guildId), "get", "json");
    }
    async getWebhook(webhookId, token) {
        if (token)
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), "get", "json");
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), "get", "json");
    }
    async updateWebhook(webhookId, token, data) {
        if (token)
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), "patch", "json", data);
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), "patch", "json", data);
    }
    async deleteWebhook(webhookId, token) {
        if (token)
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), "delete", "json");
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK(webhookId), "delete", "json");
    }
    async executeWebhook(webhookId, token, data = {}, options = { disableEveryone: this.disableEveryone }) {
        if (typeof data !== "string" && !data.content && !data.embeds && !data.file) {
            throw new Error("Missing content or embeds");
        }
        if (typeof data === "string") {
            data = { content: data };
        }
        if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.content = data.content.replace(/@([^<>@ ]*)/gsmu, (match, target) => {
                if (target.match(/^[&!]?\d+$/)) {
                    return `@${target}`;
                }
                else {
                    return `@\u200b${target}`;
                }
            });
        }
        if (data.file)
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), "post", "multipart", data);
        else
            return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN(webhookId, token), "post", "json", data);
    }
    async executeWebhookSlack(webhookId, token, data, options = { disableEveryone: this.disableEveryone }) {
        if (data.text && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
            data.text = data.text.replace(/@([^<>@ ]*)/gsmu, (match, target) => {
                if (target.match(/^[&!]?\d+$/)) {
                    return `@${target}`;
                }
                else {
                    return `@\u200b${target}`;
                }
            });
        }
        return this.requestHandler.request(Endpoints_1.default.WEBHOOK_TOKEN_SLACK(webhookId, token), "post", "json", data);
    }
}
module.exports = WebhookMethods;
