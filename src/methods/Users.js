const Endpoints = require('../Endpoints');
const UserCache = require("../cache/UserCache");

/**
 * Methods for interacting with users
 */
class UserMethods {
    /**
     * Create a new User Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.user.method`, where `client` is an initialized SnowTransfer instance
     * @param {import("../RequestHandler")} requestHandler
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
        this.cache = new UserCache(this);
    }

    /**
     * Get information about current user
     * @returns {Promise<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getSelf() {
        return this.cache.wrap("@me", this.requestHandler.request(Endpoints.USER('@me'), 'get', 'json'));
    }

    /**
     * Get information about a user via Id
     * @param {string} userId - Id of the user
     * @returns {Promise<User>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getUser(userId) {
        return this.cache.wrap(userId, this.requestHandler.request(Endpoints.USER(userId), 'get', 'json'));
    }

    /**
     * Update the current user
     * @param {object} data
     * @param {string} [data.username] - Username to change
     * @param {string} [data.avatar] - Base64 encoded avatar
     * @returns {Promise<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     *
     * @example
     * // update the avatar of the user
     * let client = new SnowTransfer('TOKEN');
     * let fileData = fs.readFileSync('new_avatar.png') // You should probably use fs.readFile, since it's asynchronous, synchronous methods may lag your bot.
     * let updateData = {
     *   avatar: `data:image/png;base64,${fileData.toString('base64')}` // base64 data url: data:mimetype;base64,base64String
     * }
     * client.user.updateSelf(updateData)
     */
    async updateSelf(data) {
        return this.cache.wrap("@me", this.requestHandler.request(Endpoints.USER('@me'), 'patch', 'json', null, data));
    }

    /**
     * Get guilds of the current user
     * @returns {Promise<import("./Guilds").Guild[]>} Array of [partial guild objects](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async getGuilds() {
        return this.requestHandler.request(Endpoints.USER_GUILDS('@me'), 'get', 'json');
    }

    /**
     * Leave a guild
     * @param {string} guildId - Id of the guild
     * @returns {Promise<void>} Resolves the Promise on successful execution
     */
    async leaveGuild(guildId) {
        return this.requestHandler.request(Endpoints.USER_GUILD('@me', guildId), 'delete', 'json');
    }

    /**
     * Get direct messages of a user
     *
     * **Returns an empty array for bots**
     * @returns {Promise<import("./Channels").Channel[]>} Array of [dm channels](https://discordapp.com/developers/docs/resources/channel#channel-object)
     */
    async getDirectMessages() {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'get', 'json');
    }

    /**
     * Create a direct message channel with another user
     *
     * **You can not create a dm with another bot**
     * @param {string} userId - Id of the user to create the direct message channel with
     * @returns {Promise<import("./Channels").Channel>} [DM channel](https://discordapp.com/developers/docs/resources/channel#channel-object)
     *
     * @example
     * // Create a dm channel and send "hi" to it
     * let client = new SnowTransfer('TOKEN');
     * let channel = await client.user.createDirectMessageChannel('other user id')
     * client.channel.createMessage(channel.id, 'hi')
     */
    async createDirectMessageChannel(userId) {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'post', 'json', null, {recipient_id: userId});
    }
}

/**
 * @typedef {object} User
 * @property {string} id - Id of the user
 * @property {string} username - username of the user
 * @property {string} discriminator - 4 digit long discord tag
 * @property {string} avatar - avatar hash of the user
 */

/**
 * @typedef {User} SelfUser
 * @property {Boolean} bot - if the user is a bot
 * @property {Boolean} mfa_enabled - if the user has mfa enabled
 * @property {Boolean} verified - if the user is verified
 * @property {string} email - email of the user
 */
module.exports = UserMethods;
