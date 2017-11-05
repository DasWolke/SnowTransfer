const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with users
 */
class UserMethods {
    /**
     * Create a new User Method handler
     * @param {RequestHandler} requestHandler
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get information about current user
     * @returns {Promise.<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getSelf() {
        return this.requestHandler.request(Endpoints.USER('@me'), 'get', 'json');
    }

    /**
     * Get information about a user via id
     * @param {String} userId - id of the user
     * @returns {Promise.<User>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getUser(userId) {
        return this.requestHandler.request(Endpoints.USER(userId), 'get', 'json');
    }

    /**
     * Update the current user
     * @param {Object} data
     * @param {String} [data.username] - Username to change
     * @param {String} [data.avatar] - Base64 encoded avatar
     * @returns {Promise.<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async updateSelf(data) {
        return this.requestHandler.request(Endpoints.USER('@me'), 'patch', 'json', data);
    }

    /**
     * Get guilds of the current user
     * @returns {Promise.<Guild[]>} Array of [partial guild objects](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async getGuilds() {
        return this.requestHandler.request(Endpoints.USER_GUILDS('@me'), 'get', 'json');
    }

    /**
     * Leave a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise}
     */
    async leaveGuild(guildId) {
        return this.requestHandler.request(Endpoints.USER_GUILD('@me', guildId), 'delete', 'json');
    }

    /**
     * Get direct messages of a user
     * returns an empty array for bots
     * @returns {Promise.<Channel[]>} array of [dm channels](https://discordapp.com/developers/docs/resources/channel#channel-object)
     */
    async getDirectMessages() {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'get', 'json');
    }

    /**
     * Create a direct message channel with a user
     * @param {String} userId - id of the user to create the direct message channel with
     * @returns {Promise.<Channel>} [dm channel](https://discordapp.com/developers/docs/resources/channel#channel-object)
     */
    async createDirectMessageChannel(userId) {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'post', 'json', {recipient_id: userId});
    }
}

/**
 * @typedef {Object} User
 * @property {String} id - id of the user
 * @property {String} username - username of the user
 * @property {String} discriminator - 4 digit long discord tag
 * @property {String} avatar - avatar hash of the user
 */

/**
 * @typedef {User} SelfUser
 * @property {Boolean} bot - if the user is a bot
 * @property {Boolean} mfa_enabled - if the user has mfa enabled
 * @property {Boolean} verified - if the user is verified
 * @property {String} email - email of the user
 */
module.exports = UserMethods;