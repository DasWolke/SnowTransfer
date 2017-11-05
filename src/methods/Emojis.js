const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with emojis
 */
class EmojiMethods {
    /**
     * Create a new Emoji Method handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @constructor
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get a list of emojis of a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Emoji[]>} Array of [emoji objects](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     */
    async getEmojis(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), 'get', 'json');
    }

    /**
     * Get an emoji via guildId + emojiId
     * @param {String} guildId - id of the guild
     * @param {String} emojiId - id of the emoji
     * @returns {Promise.<Emoji>} [emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     */
    async getEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'get', 'json');
    }

    /**
     * Create a new Emoji
     * @param {String} guildId - id of the guild
     * @param {Object} data
     * @param {String} data.name - name of the emoji
     * @param {String} data.image - base 64 avatar
     * @returns {Promise.<Emoji>} [emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     */
    async createEmoji(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), 'post', 'json', data);
    }

    /**
     * Update an existing emoji
     * @param {String} guildId - id of the guild
     * @param {String} emojiId - id of the emoji
     * @param {Object} data
     * @param {String} data.name - new name of the emoji
     * @returns {Promise.<Emoji>} [emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     */
    async updateEmoji(guildId, emojiId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'patch', data);
    }

    /**
     * Delete a emoji
     * @param {String} guildId - id of the guild
     * @param {String} emojiId - id of the emoji
     * @returns {Promise}
     */
    async deleteEmoji(guildId, emojiId) {
        return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), 'delete');
    }

}

/**
 * @typedef {Object} Emoji
 * @property {String} id - id of the emoji
 * @property {String} name - name of the emoji
 * @property {Array} [roles] - array of roles whitelisted to use the emoji (whitelisted apps only)
 * @property {User} [user] - User that created this emoji
 * @property {Boolean} require_colons - whether this emoji must be wrapped in colons
 * @property {Boolean} managed - whether this emoji is managed
 */

module.exports = EmojiMethods;