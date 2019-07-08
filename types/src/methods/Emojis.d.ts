import RequestHandler from "../RequestHandler";
import { TEmoji } from "../LibTypes";
/**
 * Methods for interacting with emojis
 */
declare class EmojiMethods {
    private requestHandler;
    /**
     * Create a new Emoji Method handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.emoji.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     * @constructor
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Get a list of emojis of a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Emoji[]>} Array of [emoji objects](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_EMOJIS      |    always |
     */
    getEmojis(guildId: string): Promise<TEmoji[]>;
    /**
     * Get an emoji via guildId + emojiId
     * @param {String} guildId - Id of the guild
     * @param {String} emojiId - Id of the emoji
     * @returns {Promise.<Emoji>} [Emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_EMOJIS      |    always |
     */
    getEmoji(guildId: string, emojiId: string): Promise<TEmoji>;
    /**
     * Create a new Emoji
     * @param {String} guildId - Id of the guild
     * @param {Object} data - Emoji data, check the example
     * @param {String} data.name - name of the emoji
     * @param {String} data.image - base 64 avatar
     * @returns {Promise.<Emoji>} [Emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_EMOJIS      |    always |
     * @example
     * // upload a simple png emoji with a name of "niceEmoji"
     * let client = new SnowTransfer('TOKEN');
     * let fileData = fs.readFileSync('nice_emoji.png') // You should probably use fs.readFile, since it's asynchronous, synchronous methods may lag your bot.
     * let emojiData = {
     *   name: 'niceEmoji',
     *   image: `data:image/png;base64,${fileData.toString('base64')}` // base64 data url: data:mimetype;base64,base64String
     * }
     * client.emoji.createEmoji('guild id', emojiData)
     */
    createEmoji(guildId: string, data: {
        name: string;
        image: string;
    }): Promise<TEmoji>;
    /**
     * Update an existing emoji
     * @param {String} guildId - Id of the guild
     * @param {String} emojiId - Id of the emoji
     * @param {Object} data - Emoji data, check the example
     * @param {String} data.name - new name of the emoji
     * @returns {Promise.<Emoji>} [Emoji object](https://discordapp.com/developers/docs/resources/emoji#emoji-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_EMOJIS      |    always |
     * @example
     * // Change the name of an existing emoji to "niceEmote"
     * let client = new SnowTransfer('TOKEN');
     * let emojiData = {
     *   name: 'niceEmote'
     * }
     * client.emoji.updateEmoji('guild id', 'emoji id', emojiData)
     */
    updateEmoji(guildId: string, emojiId: string, data: {
        name: string;
    }): Promise<TEmoji>;
    /**
     * Delete a emoji
     * @param {String} guildId - Id of the guild
     * @param {String} emojiId - Id of the emoji
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_EMOJIS      |    always |
     */
    deleteEmoji(guildId: string, emojiId: string): Promise<void>;
}
/**
 * @typedef {Object} Emoji
 * @property {String} id - Id of the emoji
 * @property {String} name - name of the emoji
 * @property {Array} [roles] - array of roles whitelisted to use the emoji (whitelisted apps only)
 * @property {User} [user] - User that created this emoji
 * @property {Boolean} require_colons - whether this emoji must be wrapped in colons
 * @property {Boolean} managed - whether this emoji is managed
 */
export default EmojiMethods;
//# sourceMappingURL=Emojis.d.ts.map