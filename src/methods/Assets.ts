import Constants = require("../Constants");
import Endpoints = require("../Endpoints");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIGuildEmojiResult,
	RESTDeleteAPIGuildStickerResult,
	RESTGetAPIApplicationEmojisResult,
	RESTGetAPIApplicationEmojiResult,
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
	RESTPostAPIGuildStickerResult,
	RESTPostAPIApplicationEmojiResult,
	RESTPostAPIApplicationEmojiJSONBody,
	RESTPatchAPIApplicationEmojiJSONBody,
	RESTPatchAPIApplicationEmojiResult,
	RESTDeleteAPIApplicationEmojiResult
} from "discord-api-types/v10";

import type { Blob } from "buffer";

import type { Readable } from "stream";
import type { ReadableStream } from "stream/web";

/**
 * Methods for interacting with assets like emojis and stickers for a guild/app
 * @since 0.13.0
 */
class AssetsMethods {
	/**
	 * Create a new Assets Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.assets.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get a list of emojis of a guild
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @returns Array of [emoji objects](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const emojis = await client.assets.getGuildEmojis("guild id")
	 */
	public async getGuildEmojis(guildId: string): Promise<RESTGetAPIGuildEmojisResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), {}, "get", "json");
	}

	/**
	 * Get an emoji from a guild via id
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param emojiId Id of the emoji
	 * @returns [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const emoji = await client.assets.getGuildEmoji("guild id", "emoji id")
	 */
	public async getGuildEmoji(guildId: string, emojiId: string): Promise<RESTGetAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "get", "json");
	}

	/**
	 * Create a new Emoji in a guild
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param data Emoji data, check the example
	 * @param reason Reason for creating the emoji
	 * @returns [Emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // upload a simple png emoji with a name of "niceEmoji"
	 * const client = new SnowTransfer("TOKEN")
	 * const fileData = fs.readFileSync("nice_emoji.png") // You should probably use fs.promises.readFile, since it is asynchronous, synchronous methods pause the thread.
	 * const emojiData = \{
	 * 	name: "niceEmoji",
	 * 	image: `data:image/png;base64,${fileData.toString("base64")}` // base64 data url: data:mimetype;base64,base64String
	 * \}
	 * client.assets.createGuildEmoji("guild id", emojiData)
	 */
	public async createGuildEmoji(guildId: string, data: RESTPostAPIGuildEmojiJSONBody, reason?: string): Promise<RESTPostAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJIS(guildId), {}, "post", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Update an existing emoji from a guild
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param emojiId Id of the emoji
	 * @param data Emoji data
	 * @param reason Reason for updating the emoji
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
	 * client.assets.updateGuildEmoji("guild id", "emoji id", emojiData)
	 */
	public async updateGuildEmoji(guildId: string, emojiId: string, data: RESTPatchAPIGuildEmojiJSONBody, reason?: string): Promise<RESTPatchAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "patch", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Delete an emoji from a guild
	 * @since 0.13.0
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
	 * client.assets.deleteGuildEmoji("guild id", "emoji id", "wasn't nice")
	 */
	public async deleteGuildEmoji(guildId: string, emojiId: string, reason?: string): Promise<RESTDeleteAPIGuildEmojiResult> {
		return this.requestHandler.request(Endpoints.GUILD_EMOJI(guildId, emojiId), {}, "delete", "json", {}, Constants.reasonHeader(reason)) as RESTDeleteAPIGuildEmojiResult;
	}

	/**
	 * Get a global sticker
	 * @since 0.13.0
	 * @param stickerId Id of the sticker
	 * @returns [Sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const sticker = await client.assets.getSticker("sticker id")
	 */
	public async getSticker(stickerId: string): Promise<RESTGetAPIStickerResult> {
		return this.requestHandler.request(Endpoints.STICKER(stickerId), {}, "get", "json");
	}

	/**
	 * Get all guild stickers
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @returns An Array of [sticker objects](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed         | Condition                                   |
	 * |----------------------------|---------------------------------------------|
	 * | MANAGE_EMOJIS_AND_STICKERS | if the CurrentUser desires the `user` field |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const stickers = await client.assets.getGuildStickers("guild id")
	 */
	public async getGuildStickers(guildId: string): Promise<RESTGetAPIGuildStickersResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKERS(guildId), {}, "get", "json");
	}

	/**
	 * Get a guild sticker
	 * @since 0.13.0
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
	 * const sticker = await client.assets.getGuildSticker("guild id", "sticker id")
	 */
	public async getGuildSticker(guildId: string, stickerId: string): Promise<RESTGetAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "get", "json");
	}

	/**
	 * Create a guild sticker
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param data Sticker data
	 * @param reason Reason for creating the sticker
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
	 * const fileData = fs.readFileSync("nice_sticker.json") // You should probably use fs.promises.readFile, since it is asynchronous, synchronous methods pause the thread.
	 * const stickerData = {
	 * 	name: "niceSticker",
	 * 	file: fileData,
	 * 	description: "A very nice sticker",
	 * 	tags: ["nice", "sticker"],
	 * }
	 * const sticker = await client.assets.createGuildSticker("guild id", stickerData)
	 */
	public async createGuildSticker(guildId: string, data: RESTPostAPIGuildStickerFormDataBody & { file: Buffer | Blob | File | Readable | ReadableStream; }, reason?: string): Promise<RESTPostAPIGuildStickerResult> {
		const form = new FormData();

		for (const key of Object.keys(data)) {
			await Constants.standardAddToFormHandler(form, key, data[key]);
		}

		return this.requestHandler.request(Endpoints.GUILD_STICKERS(guildId), {}, "post", "multipart", form, Constants.reasonHeader(reason));
	}

	/**
	 * Update a guild sticker
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param stickerId Id of the sticker
	 * @param data Sticker data
	 * @param reason Reason for updating the sticker
	 * @returns A [sticker object](https://discord.com/developers/docs/resources/sticker#sticker-object)
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Updates a sticker's name to "nicerSticker"
	 * const client = new SnowTransfer("TOKEN")
	 * const sticker = await client.assets.updateGuildSticker("guild id", "sticker id", { name: "nicerSticker" }, "because it was nicer")
	 */
	public async updateGuildSticker(guildId: string, stickerId: string, data: RESTPatchAPIGuildStickerJSONBody, reason?: string): Promise<RESTPatchAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "patch", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Delete a guild sticker
	 * @since 0.13.0
	 * @param guildId Id of the guild
	 * @param stickerId Id of the sticker
	 * @param reason Reason for deleting the sticker
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed         | Condition |
	 * |----------------------------|-----------|
	 * | MANAGE_EMOJIS_AND_STICKERS | always    |
	 *
	 * @example
	 * // Deletes a sticker because it was too nice
	 * const client = new SnowTransfer("TOKEN")
	 * client.assets.deleteGuildSticker("guild id", "sticker id", "It was too nice")
	 */
	public async deleteGuildSticker(guildId: string, stickerId: string, reason?: string): Promise<RESTDeleteAPIGuildStickerResult> {
		return this.requestHandler.request(Endpoints.GUILD_STICKER(guildId, stickerId), {}, "delete", "json", {}, Constants.reasonHeader(reason)) as RESTDeleteAPIGuildStickerResult;
	}

	/**
	 * Get all emojis for an app
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @returns An Array of [emoji objects](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * // Gets all emojis for an app
	 * const client = new SnowTransfer("TOKEN")
	 * const emojis = await client.assets.getAppEmojis("app id")
	 */
	public async getAppEmojis(appId: string): Promise<RESTGetAPIApplicationEmojisResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_EMOJIS(appId), {}, "get", "json");
	}

	/**
	 * Get an emoji for an app by id
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param emojiId Id of the emoji
	 * @returns [emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * // Gets an emoji by id from an app
	 * const client = new SnowTransfer("TOKEN")
	 * const emoji = await client.assets.getAppEmoji("app id", "emoji id")
	 */
	public async getAppEmoji(appId: string, emojiId: string): Promise<RESTGetAPIApplicationEmojiResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_EMOJI(appId, emojiId), {}, "get", "json");
	}

	/**
	 * Create an emoji for an app
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param data Emoji data, check the example
	 * @returns [emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * // Creates an emoji for an app with a NICER name
	 * const client = new SnowTransfer("TOKEN")
	 * const fileData = fs.readFileSync("even_nicer_emoji.png") // You should probably use fs.promises.readFile, since it is asynchronous, synchronous methods pause the thread.
	 * const emojiData = \{
	 * 	name: "nicerEmoji",
	 * 	image: `data:image/png;base64,${fileData.toString("base64")}` // base64 data url: data:mimetype;base64,base64String
	 * \}
	 * client.assets.createAppEmoji("app id", emojiData)
	 */
	public async createAppEmoji(appId: string, data: RESTPostAPIApplicationEmojiJSONBody): Promise<RESTPostAPIApplicationEmojiResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_EMOJIS(appId), {}, "post", "json", data);
	}

	/**
	 * Updates an emoji for an app
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param emojiId Id of the emoji
	 * @param data Emoji data
	 * @returns [emoji object](https://discord.com/developers/docs/resources/emoji#emoji-object)
	 *
	 * @example
	 * // The emoji we just made is actually the nicest emoji ever. Gotta reflect that
	 * const client = new SnowTransfer("TOKEN")
	 * const emojiData = {
	 * 	name: "nicestEmoji"
	 * }
	 * client.assets.updateAppEmoji("app id", "emoji id", emojiData)
	 */
	public async updateAppEmoji(appId: string, emojiId: string, data: RESTPatchAPIApplicationEmojiJSONBody): Promise<RESTPatchAPIApplicationEmojiResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_EMOJI(appId, emojiId), {}, "patch", "json", data);
	}

	/**
	 * Delete an emoji for an app
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param emojiId Id of the emoji
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * // The emoji was TOO POWERFUL. WE NEED TO REMOVE IT
	 * const client = new SnowTransfer("TOKEN")
	 * client.assets.deleteAppEmoji("app id", "emoji id") // OH GOD THE UNIVERSE IS COLLAPSING
	 * // We're safe. The emoji is gone. For now...
	 */
	public async deleteAppEmoji(appId: string, emojiId: string): Promise<RESTDeleteAPIApplicationEmojiResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_EMOJI(appId, emojiId), {}, "delete", "json") as Promise<RESTDeleteAPIApplicationEmojiResult>;
	}
}

export = AssetsMethods;
