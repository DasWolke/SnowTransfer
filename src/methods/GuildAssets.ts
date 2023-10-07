import FormData = require("form-data");

import Endpoints = require("../Endpoints");

import type {
	RESTDeleteAPIGuildEmojiResult,
	RESTDeleteAPIGuildStickerResult,
	RESTGetAPIGuildEmojiResult,
	RESTGetAPIGuildEmojisResult,
	RESTGetAPIGuildStickerResult,
	RESTGetAPIGuildStickersResult,
	RESTGetAPIStickerResult,
	RESTPatchAPIGuildEmojiJSONBody,
	RESTPatchAPIGuildEmojiResult,
	RESTPatchAPIGuildStickerJSONBody,
	RESTPatchAPIGuildStickerResult,
	RESTPostAPIGuildEmojiJSONBody,
	RESTPostAPIGuildEmojiResult,
	RESTPostAPIGuildStickerFormDataBody,
	RESTPostAPIGuildStickerResult
} from "discord-api-types/v10";

import { Readable } from "stream";
import { ReadableStream } from "stream/web";

/**
 * Methods for interacting with emojis
 */
class GuildAssetsMethods {
	/**
	 * Create a new GuildAssets Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildAssets.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: InstanceType<(typeof import("../RequestHandler"))["RequestHandler"]>) {}

	/**
	 * Get a list of emojis of a guild
	 * @param guildId Id of the guild
	 * @returns Array of [emoji objects](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const emojis = await client.guildAssets.getEmojis("guild id")
	 */
	public async getEmojis(guildId: string): Promise<RESTGetAPIGuildEmojisResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), {}, "get", "json");
	}

	/**
	 * Get an emoji via guildId + emojiId
	 * @param guildId Id of the guild
	 * @param emojiId Id of the emoji
	 * @returns [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const emoji = await client.guildAssets.getEmoji("guild id", "emoji id")
	 */
	public async getEmoji(guildId: string, emojiId: string): Promise<RESTGetAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "get", "json");
	}

	/**
	 * Create a new Emoji
	 * @param guildId Id of the guild
	 * @param data Emoji data, check the example
	 * @returns [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // upload a simple png emoji with a name of "niceEmoji"
	 * const client = new SnowTransfer("TOKEN")
	 * const fileData = fs.readFileSync("nice_emoji.png") // You should probably use fs.readFile, since it is asynchronous, synchronous methods pause the thread.
	 * const emojiData = \{
	 * 	name: "niceEmoji",
	 * 	image: `data:image/png;base64,${fileData.toString("base64")}` // base64 data url: data:mimetype;base64,base64String
	 * \}
	 * client.guildAssets.createEmoji("guild id", emojiData)
	 */
	public async createEmoji(guildId: string, data: RESTPostAPIGuildEmojiJSONBody & { reason?: string; }): Promise<RESTPostAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), {}, "post", "json", data);
	}

	/**
	 * Update an existing emoji
	 * @param {string} guildId Id of the guild
	 * @param {string} emojiId Id of the emoji
	 * @param {object} data Emoji data
	 * @returns [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Change the name of an existing emoji to "niceEmote"
	 * const client = new SnowTransfer("TOKEN")
	 * const emojiData = {
	 * 	name: "niceEmote"
	 * }
	 * client.guildAssets.updateEmoji("guild id", "emoji id", emojiData)
	 */
	public async updateEmoji(guildId: string, emojiId: string, data: RESTPatchAPIGuildEmojiJSONBody & { reason?: string; }): Promise<RESTPatchAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "patch", "json", data);
	}

	/**
	 * Delete an emoji
	 * @param guildId Id of the guild
	 * @param emojiId Id of the emoji
	 * @param reason Reason for deleting the emoji
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Deletes an emoji because it wasn't nice
	 * const client = new SnowTransfer("TOKEN")
	 * client.guildAssets.deleteEmoji("guild id", "emoji id", "wasn't nice")
	 */
	public async deleteEmoji(guildId: string, emojiId: string, reason?: string): Promise<RESTDeleteAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildEmojiResult;
	}

	/**
	 * Get a global sticker
	 * @param stickerId Id of the sticker
	 * @returns [Sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const sticker = await client.guildAssets.getSticker("sticker id")
	 */
	public async getSticker(stickerId: string): Promise<RESTGetAPIStickerResult> {
		return this.requestHandler.request(Endpoints.STICKER(stickerId), {}, "get", "json");
	}

	/**
	 * Get all guild stickers
	 * @param guildId Id of the guild
	 * @returns An Array of [sticker objects](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed         | Condition                                   |
	 * |----------------------------|---------------------------------------------|
	 * | MANAGE_EMOJIS_AND_STICKERS | if the CurrentUser desires the `user` field |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const stickers = await client.guildAssets.getGuildStickers("guild id")
	 */
	public async getGuildStickers(guildId: string): Promise<RESTGetAPIGuildStickersResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKERS(guildId), {}, "get", "json");
	}

	/**
	 * Get a guild sticker
	 * @param guildId Id of the guild
	 * @param stickerId Id of the sticker
	 * @returns A [sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed         | Condition                                   |
	 * |----------------------------|---------------------------------------------|
	 * | MANAGE_EMOJIS_AND_STICKERS | if the CurrentUser desires the `user` field |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const sticker = await client.guildAssets.getGuildSticker("guild id", "sticker id")
	 */
	public async getGuildSticker(guildId: string, stickerId: string): Promise<RESTGetAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "get", "json");
	}

	/**
	 * Create a guild sticker
	 * @param guildId Id of the guild
	 * @param data Sticker data
	 * @returns A [sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed          | Condition                                       |
	 * |-----------------------------|-------------------------------------------------|
	 * | MANAGE_EMOJIS_AND_STICKERS  | always                                          |
	 *
	 * | Guild Features needed | Condition                                       |
	 * |-----------------------|-------------------------------------------------|
	 * | VERIFIED or PARTNERED | If CurrentUser tries to create a LOTTIE sticker |
	 *
	 * @example
	 * // Creates a LOTTIE sticker
	 * const client = new SnowTransfer("TOKEN")
	 * const fileData = fs.readFileSync("nice_sticker.json") // You should probably use fs.readFile, since it is asynchronous, synchronous methods pause the thread.
	 * const stickerData = {
	 * 	name: "niceSticker",
	 * 	file: fileData,
	 * 	description: "A very nice sticker",
	 * 	tags: ["nice", "sticker"],
	 * }
	 * const sticker = await client.guildAssets.createGuildSticker("guild id", stickerData)
	 */
	public createGuildSticker(guildId: string, data: RESTPostAPIGuildStickerFormDataBody & { file: Buffer | Readable | ReadableStream; reason?: string; }): Promise<RESTPostAPIGuildStickerResult> {
		const form = new FormData();
		const reason = data.reason;
		if (data.reason) delete data.reason;
		for (const key of Object.keys(data)) {
			form.append(key, data[key] instanceof ReadableStream ? Readable.fromWeb(data[key]) : data[key]);
		}
		return this.requestHandler.request(Endpoints.GUILD_STICKERS(guildId), {}, "post", "multipart", form, reason ? { "X-Audit-Log-Reason": reason } : undefined);
	}

	/**
	 * Update a guild sticker
	 * @param guildId Id of the guild
	 * @param stickerId Id of the sticker
	 * @param data Sticker data
	 * @returns A [sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Updates a sticker's name to "nicerSticker"
	 * const client = new SnowTransfer("TOKEN")
	 * const sticker = await client.guildAssets.updateGuildSticker("guild id", "sticker id", { name: "nicerSticker", reason: "because it was nicer" })
	 */
	public updateGuildSticker(guildId: string, stickerId: string, data: RESTPatchAPIGuildStickerJSONBody & { reason?: string; }): Promise<RESTPatchAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "patch", "json", data);
	}

	/**
	 * Delete a guild sticker
	 * @param guildId Id of the guild
	 * @param stickerId Id of the sticker
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Deletes a sticker because it was too nice
	 * const client = new SnowTransfer("TOKEN")
	 * client.guildAssets.deleteGuildSticker("guild id", "sticker id", "It was too nice")
	 */
	public deleteGuildSticker(guildId: string, stickerId: string, reason?: string): Promise<RESTDeleteAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildStickerResult;
	}
}

export = GuildAssetsMethods;
