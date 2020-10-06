const Endpoints = require("../Endpoints");

/**
 * Methods for interacting with emojis
 */
class EmojiMethods {
	/**
	 * Create a new Emoji Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.emoji.method`, where `client` is an initialized SnowTransfer instance
	 * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
	 * @constructor
	 */
	constructor(requestHandler) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get a list of emojis of a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<Emoji[]>} Array of [emoji objects](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_EMOJIS      |    always |
	 */
	async getEmojis(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), "get", "json");
	}

	/**
	 * Get an emoji via guildId + emojiId
	 * @param {string} guildId - Id of the guild
	 * @param {string} emojiId - Id of the emoji
	 * @returns {Promise<Emoji>} [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_EMOJIS      |    always |
	 */
	async getEmoji(guildId, emojiId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), "get", "json");
	}

	/**
	 * Create a new Emoji
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - Emoji data, check the example
	 * @param {string} data.name - name of the emoji
	 * @param {string} data.image - base 64 avatar
	 * @returns {Promise<Emoji>} [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
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
	async createEmoji(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), "post", "json", data);
	}

	/**
	 * Update an existing emoji
	 * @param {string} guildId - Id of the guild
	 * @param {string} emojiId - Id of the emoji
	 * @param {object} data - Emoji data, check the example
	 * @param {string} data.name - new name of the emoji
	 * @returns {Promise<Emoji>} [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
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
	async updateEmoji(guildId, emojiId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), "patch", "json", data);
	}

	/**
	 * Delete a emoji
	 * @param {string} guildId - Id of the guild
	 * @param {string} emojiId - Id of the emoji
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_EMOJIS      |    always |
	 */
	async deleteEmoji(guildId, emojiId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), "delete");
	}

}

/**
 * @typedef {object} Emoji
 * @property {string} id - Id of the emoji
 * @property {string} name - name of the emoji
 * @property {Array} [roles] - array of roles whitelisted to use the emoji (whitelisted apps only)
 * @property {import("./Users").User} [user] - User that created this emoji
 * @property {Boolean} require_colons - whether this emoji must be wrapped in colons
 * @property {Boolean} managed - whether this emoji is managed
 */

module.exports = EmojiMethods;
