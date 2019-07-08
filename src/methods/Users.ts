import Endpoints from "../Endpoints";
import RequestHandler from "../RequestHandler";
import { TUser, TGuild, TChannel, TSelfUser } from "../LibTypes";

/**
 * Methods for interacting with users
 */
class UserMethods {

    private requestHandler: RequestHandler

    /**
     * Create a new User Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.user.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler
     */
    constructor(requestHandler:RequestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get information about current user
     * @returns {Promise.<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getSelf(): Promise<TSelfUser> {
        return this.requestHandler.request(Endpoints.USER('@me'), 'get', 'json');
    }

    /**
     * Get information about a user via Id
     * @param {String} userId - Id of the user
     * @returns {Promise.<User>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
     */
    async getUser(userId: string): Promise<TUser> {
        return this.requestHandler.request(Endpoints.USER(userId), 'get', 'json');
    }

    /**
     * Update the current user
     * @param {Object} data
     * @param {String} [data.username] - Username to change
     * @param {String} [data.avatar] - Base64 encoded avatar
     * @returns {Promise.<SelfUser>} [user object](https://discordapp.com/developers/docs/resources/user#user-object)
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
    async updateSelf(data: { username? : string, avatar?: string}) :Promise<TSelfUser> {
        return this.requestHandler.request(Endpoints.USER('@me'), 'patch', 'json', data);
    }

    /**
     * Get guilds of the current user
     * @returns {Promise.<Guild[]>} Array of [partial guild objects](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async getGuilds(): Promise<TGuild[]> {
        return this.requestHandler.request(Endpoints.USER_GUILDS('@me'), 'get', 'json');
    }

    /**
     * Leave a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    async leaveGuild(guildId: string): Promise<void> {
        return this.requestHandler.request(Endpoints.USER_GUILD('@me', guildId), 'delete', 'json');
    }

    /**
     * Get direct messages of a user
     *
     * **Returns an empty array for bots**
     * @returns {Promise.<Channel[]>} Array of [dm channels](https://discordapp.com/developers/docs/resources/channel#channel-object)
     */
    async getDirectMessages(): Promise<TChannel[]> {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'get', 'json');
    }

    /**
     * Create a direct message channel with another user
     *
     * **You can not create a dm with another bot**
     * @param {String} userId - Id of the user to create the direct message channel with
     * @returns {Promise.<Channel>} [DM channel](https://discordapp.com/developers/docs/resources/channel#channel-object)
     *
     * @example
     * // Create a dm channel and send "hi" to it
     * let client = new SnowTransfer('TOKEN');
     * let channel = await client.user.createDirectMessageChannel('other user id')
     * client.channel.createMessage(channel.id, 'hi')
     */
    async createDirectMessageChannel(userId: string): Promise<TChannel> {
        return this.requestHandler.request(Endpoints.USER_CHANNELS('@me'), 'post', 'json', {recipient_id: userId});
    }
}

/**
 * @typedef {Object} User
 * @property {String} id - Id of the user
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
export default UserMethods;