"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
const Constants_1 = __importDefault(require("../Constants"));
class ChannelMethods {
    constructor(requestHandler, disableEveryone) {
        this.requestHandler = requestHandler;
        this.disableEveryone = disableEveryone;
    }
    async getChannel(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL(channelId), "get", "json");
    }
    async updateChannel(channelId, data) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL(channelId), "patch", "json", data);
    }
    async deleteChannel(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL(channelId), "delete", "json");
    }
    async getChannelMessages(channelId, options = { limit: 50 }) {
        if (options.around) {
            delete options.before;
            delete options.after;
        }
        else if (options.before) {
            delete options.around;
            delete options.after;
        }
        else if (options.after) {
            delete options.before;
            delete options.around;
        }
        if (options.limit && options.limit > Constants_1.default.GET_CHANNEL_MESSAGES_MAX_RESULTS) {
            throw new Error(`The maximum amount of messages that may be requested is ${Constants_1.default.GET_CHANNEL_MESSAGES_MAX_RESULTS}`);
        }
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGES(channelId), "get", "json", options);
    }
    async getChannelMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE(channelId, messageId), "get", "json");
    }
    async createMessage(channelId, data, options = { disableEveryone: this.disableEveryone }) {
        if (typeof data !== "string" && !data.content && !data.embed && !data.file) {
            throw new Error("Missing content or embed");
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
        if (data.file) {
            return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGES(channelId), "post", "multipart", data);
        }
        else {
            return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGES(channelId), "post", "json", data);
        }
    }
    async editMessage(channelId, messageId, data, options = { disableEveryone: this.disableEveryone }) {
        if (typeof data !== "string" && !data.content && !data.embed) {
            throw new Error("Missing content or embed");
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
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE(channelId, messageId), "patch", "json", data);
    }
    async deleteMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE(channelId, messageId), "delete", "json");
    }
    async bulkDeleteMessages(channelId, messages) {
        if (messages.length < Constants_1.default.BULK_DELETE_MESSAGES_MIN || messages.length > Constants_1.default.BULK_DELETE_MESSAGES_MAX) {
            throw new Error(`Amount of messages to be deleted has to be between ${Constants_1.default.BULK_DELETE_MESSAGES_MIN} and ${Constants_1.default.BULK_DELETE_MESSAGES_MAX}`);
        }
        const oldestSnowflake = (Date.now() - 1421280000000) * 2 ** 22;
        const forbiddenMessage = messages.find(m => (+m) < oldestSnowflake);
        if (forbiddenMessage) {
            throw new Error(`The message ${forbiddenMessage} is older than 2 weeks and may not be deleted using the bulk delete endpoint`);
        }
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_BULK_DELETE(channelId), "post", "json", { messages });
    }
    async createReaction(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), "put", "json");
    }
    async deleteReactionSelf(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), "delete", "json");
    }
    async deleteReaction(channelId, messageId, emoji, userId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId), "delete", "json");
    }
    async getReactions(channelId, messageId, emoji) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), "get", "json");
    }
    async deleteAllReactions(channelId, messageId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), "delete", "json");
    }
    async editChannelPermission(channelId, permissionId, data) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_PERMISSION(channelId, permissionId), "put", "json", data);
    }
    async deleteChannelPermission(channelId, permissionId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_PERMISSION(channelId, permissionId), "delete", "json");
    }
    async getChannelInvites(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_INVITES(channelId), "get", "json");
    }
    async createChannelInvite(channelId, data = { max_age: 86400, max_uses: 0, temporary: false, unique: false }) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_INVITES(channelId), "post", "json", data);
    }
    async startChannelTyping(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_TYPING(channelId), "post", "json");
    }
    async getChannelPinnedMessages(channelId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_PINS(channelId), "get", "json");
    }
    async addChannelPinnedMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_PIN(channelId, messageId), "put", "json");
    }
    async removeChannelPinnedMessage(channelId, messageId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_PIN(channelId, messageId), "delete", "json");
    }
    async addDmChannelRecipient(channelId, userId, data) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_RECIPIENT(channelId, userId), "put", "json", data);
    }
    async removeDmChannelRecipient(channelId, userId) {
        return this.requestHandler.request(Endpoints_1.default.CHANNEL_RECIPIENT(channelId, userId), "delete", "json");
    }
}
module.exports = ChannelMethods;
