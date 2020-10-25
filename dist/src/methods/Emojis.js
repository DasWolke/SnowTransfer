"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class EmojiMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    async getEmojis(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMOJIS(guildId), "get", "json");
    }
    async getEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMOJI(guildId, emojiId), "get", "json");
    }
    async createEmoji(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMOJIS(guildId), "post", "json", data);
    }
    async updateEmoji(guildId, emojiId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMOJI(guildId, emojiId), "patch", "json", data);
    }
    async deleteEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMOJI(guildId, emojiId), "delete");
    }
}
module.exports = EmojiMethods;
