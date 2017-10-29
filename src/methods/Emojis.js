const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with emojis
 */
class EmojiMethods {
    /**
     * Create a new Emoji Method handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @param {Object} [options] - options
     * @constructor
     */
    constructor(requestHandler, options) {
        this.requestHandler = requestHandler;
        this.options = options;
    }

    async getEmojis(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), 'get', 'json');
    }

    async getEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'get', 'json');
    }

    async createEmoji(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), 'post', 'json', data);
    }

    async updateEmoji(guildId, emojiId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'patch', data);
    }

    async deleteEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'delete');
    }
}

module.exports = EmojiMethods;