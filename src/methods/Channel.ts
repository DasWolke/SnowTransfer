import type { RequestHandler as RH, RESTPostAPIAttachmentsRefreshURLsResult } from "../RequestHandler";

import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import {
	type APITextBasedChannel,
	type APIThreadChannel,
	type ChannelType,
	type RESTDeleteAPIChannelAllMessageReactionsResult,
	type RESTDeleteAPIChannelMessageReactionResult,
	type RESTDeleteAPIChannelMessageResult,
	type RESTDeleteAPIChannelMessageUserReactionResult,
	type RESTDeleteAPIChannelPermissionResult,
	type RESTDeleteAPIChannelPinResult,
	type RESTDeleteAPIChannelResult,
	type RESTDeleteAPIChannelThreadMembersResult,
	type RESTGetAPIChannelInvitesResult,
	type RESTGetAPIChannelMessageReactionUsersQuery,
	type RESTGetAPIChannelMessageReactionUsersResult,
	type RESTGetAPIChannelMessageResult,
	type RESTGetAPIChannelMessagesQuery,
	type RESTGetAPIChannelMessagesResult,
	type RESTGetAPIChannelPinsResult,
	type RESTGetAPIChannelResult,
	type RESTGetAPIChannelThreadMemberResult,
	type RESTGetAPIChannelThreadMembersQuery,
	type RESTGetAPIChannelThreadMembersResult,
	type RESTGetAPIChannelThreadsArchivedPrivateResult,
	type RESTGetAPIChannelThreadsArchivedPublicResult,
	type RESTGetAPIChannelThreadsArchivedQuery,
	type RESTGetAPIChannelUsersThreadsArchivedResult,
	type RESTPatchAPIChannelJSONBody,
	type RESTPatchAPIChannelMessageJSONBody,
	type RESTPatchAPIChannelMessageResult,
	type RESTPatchAPIChannelResult,
	type RESTPostAPIChannelFollowersResult,
	type RESTPostAPIChannelInviteJSONBody,
	type RESTPostAPIChannelInviteResult,
	type RESTPostAPIChannelMessageCrosspostResult,
	type RESTPostAPIChannelMessageJSONBody,
	type RESTPostAPIChannelMessageResult,
	type RESTPostAPIChannelMessagesBulkDeleteResult,
	type RESTPostAPIChannelMessagesThreadsJSONBody,
	type RESTPostAPIChannelMessagesThreadsResult,
	type RESTPostAPIChannelThreadsJSONBody,
	type RESTPostAPIChannelTypingResult,
	type RESTPutAPIChannelMessageReactionResult,
	type RESTPutAPIChannelPermissionJSONBody,
	type RESTPutAPIChannelPermissionResult,
	type RESTPutAPIChannelPinResult,
	type RESTPutAPIChannelThreadMembersResult,

	MessageFlags
} from "discord-api-types/v10";

import type { Readable } from "stream";
import type { ReadableStream } from "stream/web";

/**
 * Methods for interacting with Channels and Messages
 * @since 0.1.0
 */
class ChannelMethods {
	/**
	 * Create a new Channel Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.channel.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
	 */
	public constructor(public requestHandler: RH, public disableEveryone: boolean) {}

	/**
	 * Get a channel via Id
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const channel = await client.channel.getChannel("channel id")
	 */
	public async getChannel(channelId: string): Promise<RESTGetAPIChannelResult> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), {}, "get", "json");
	}

	/**
	 * Update a guild channel or thread
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param data Data to send
	 * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * | Permissions needed | Condition                                                                                                               |
	 * |--------------------|-------------------------------------------------------------------------------------------------------------------------|
	 * | MANAGE_CHANNELS    | always                                                                                                                  |
	 * | MANAGE_ROLES       | If modifying permission overwrites                                                                                      |
	 * | SEND_MESSAGES      | When editing a Thread to change the name, archived, auto_archive_duration, rate_limit_per_user or locked fields         |
	 * | MANAGE_THREADS     | When editing a Thread and not modifying the name, archived, auto_archive_duration, rate_limit_per_user or locked fields |
	 *
	 * @example
	 * // This example updates a channel with the passed id to use "New Name" as its name and "Look at this cool topic" as the topic
	 * const client = new SnowTransfer("TOKEN")
	 * const updateData = {
	 * 	name: "New Name",
	 * 	topic: "Look at this cool topic"
	 * }
	 * client.channel.updateChannel("channel id", updateData)
	 */
	public async updateChannel(channelId: string, data: Omit<RESTPatchAPIChannelJSONBody, "archived" | "auto_archive_duration" | "locked" | "invitable"> & { reason?: string; }): Promise<Exclude<RESTPatchAPIChannelResult, APIThreadChannel>>;
	public async updateChannel(channelId: string, data: Pick<RESTPatchAPIChannelJSONBody, "archived" | "auto_archive_duration" | "locked" | "name" | "rate_limit_per_user"> & { reason?: string; }): Promise<Extract<RESTPatchAPIChannelResult, APIThreadChannel>>;
	public async updateChannel(channelId: string, data: RESTPatchAPIChannelJSONBody & { reason?: string; }): Promise<RESTPatchAPIChannelResult> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), {}, "patch", "json", data);
	}

	/**
	 * Delete a channel or thread via Id
	 *
	 * This either **deletes** a Guild Channel/thread or **closes** a Direct Message Channel
	 *
	 * **Be careful with deleting Guild Channels as this cannot be undone!**
	 *
	 * When deleting a category, this does **not** delete the child channels of a category. They will just have their `parent_id` removed.
	 *
	 * For community guilds, the rules channel and the community updates channel cannot be deleted.
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param reason Reason for deleting the channel
	 * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * | Permissions needed | Condition                      |
	 * |--------------------|--------------------------------|
	 * | MANAGE_CHANNELS    | if channel is not a DM channel |
	 * | MANAGE_THREADS     | if channel is a thread         |
	 *
	 * @example
	 * // Deletes a channel via id because it wasn't needed anymore
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteChannel("channel id", "No longer needed")
	 */
	public async deleteChannel(channelId: string, reason?: string): Promise<RESTDeleteAPIChannelResult> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), {}, "delete", "json", { reason });
	}

	/**
	 * Get a list of messages from a channel
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param options Options for getting channel messages
	 * @returns Array of [discord message](https://discord.com/developers/docs/resources/channel#message-object) objects
	 *
	 * | Permissions needed   | Condition                                                                        |
	 * |----------------------|----------------------------------------------------------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel                                                   |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel, unless you want the API to return an empty Array |
	 *
	 * @example
	 * // Fetch the last 20 messages from a channel
	 * const client = new SnowTransfer("TOKEN")
	 * const options = {
	 * 	limit: 20
	 * }
	 * const messages = await client.channel.getChannelMessages("channel id", options)
	 */
	public async getChannelMessages(channelId: string, options: RESTGetAPIChannelMessagesQuery = { limit: 50 }): Promise<RESTGetAPIChannelMessagesResult> {
		if (options.around) {
			delete options.before;
			delete options.after;
		} else if (options.before) {
			delete options.around;
			delete options.after;
		} else if (options.after) {
			delete options.before;
			delete options.around;
		}
		if (options.limit !== undefined && (options.limit < Constants.GET_CHANNEL_MESSAGES_MIN_RESULTS || options.limit > Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS)) throw new RangeError(`Amount of messages that may be requested has to be between ${Constants.GET_CHANNEL_MESSAGES_MIN_RESULTS} and ${Constants.GET_CHANNEL_MESSAGES_MAX_RESULTS}`);
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), options, "get", "json");
	}

	/**
	 * Get a single message via Id
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * | Permissions needed   | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 *
	 * @example
	 * // Get a single message from a channel via id
	 * const client = new SnowTransfer("TOKEN")
	 * const message = await client.channel.getChannelMessage("channel id", "message id")
	 */
	public async getChannelMessage(channelId: string, messageId: string): Promise<RESTGetAPIChannelMessageResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), {}, "get", "json");
	}

	/**
	 * Creates a new Message within a channel or thread
	 *
	 * **Make sure to use a filename with a proper extension (e.g. png, jpeg, etc.) when you want to upload files**
	 * @since 0.1.0
	 * @param channelId Id of the Channel or thread to send a message to
	 * @param data Data to send, if data is a string it will be used as the content of the message,
	 * if data is not a string you should take a look at the properties below to know what you may send
	 * @param options Options for sending this message
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * | Permissions needed       | Condition                                                     |
	 * |--------------------------|---------------------------------------------------------------|
	 * | VIEW_CHANNEL             | if channel is not a DM channel                                |
	 * | READ_MESSAGE_HISTORY     | if channel is not a DM channel and message is a reply         |
	 * | SEND_MESSAGES            | if channel is not a DM channel and if channel is not a thread |
	 * | SEND_TTS_MESSAGES        | if channel is not a DM channel and tts is set to true         |
	 * | SEND_MESSAGES_IN_THREADS | if channel is a thread                                        |
	 *
	 * @example
	 * // Make a bot say "hi" within a channel
	 * // createMessage sends the passed data as content, when you give it a string
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.createMessage("channel id", "hi")
	 *
	 * @example
	 * // Send a rich embed object
	 * const client = new SnowTransfer("TOKEN")
	 * const embedData = {
	 * 	title: "This is a nice embed",
	 * 	description: "But winter is so cold",
	 * 	fields: [
	 * 		{ name: "Brr", value: "Insert snowflake emoji here" }
	 * 	]
	 * }
	 * client.channel.createMessage("channel id", { embeds: [embedData] })
	 *
	 * @example
	 * // Send a file with a comment
	 * const client = new SnowTransfer("TOKEN")
	 * // fileData will be a buffer with the data of the png image.
	 * const fileData = fs.readFileSync("nice_picture.png") // You should probably use fs.promises.readFile, since it is asynchronous, synchronous methods block the thread.
	 * client.channel.createMessage("channel id", { content: "This is a nice picture", files: [{ name: "Optional_Filename.png", file: fileData }] })
	 */
	public async createMessage(channelId: string, data: string | RESTPostAPIChannelMessageJSONBody & { files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<RESTPostAPIChannelMessageResult> {
		if (typeof data !== "string" && !data.content && !data.embeds && !data.sticker_ids && !data.components && !data.files && !data.poll) throw new Error("Missing content, embeds, sticker_ids, components, files, or poll");
		if (typeof data === "string") data = { content: data };

		if ((data.content || data.embeds) && data.flags && (data.flags & MessageFlags.IsComponentsV2) === MessageFlags.IsComponentsV2) throw new Error("The message flags was set to include IsComponentsV2, but content and embeds were also present. You can either have content/embeds or components v2, not both.");

		// Sanitize the message
		if (data.content && (options.disableEveryone ?? this.disableEveryone)) data.content = Constants.replaceEveryone(data.content);

		if (data.files) return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), {}, "post", "multipart", await Constants.standardMultipartHandler(data as Parameters<typeof Constants["standardMultipartHandler"]>["0"]));
		else return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), {}, "post", "json", data);
	}

	/**
	 * Creates a new voice Message within a channel or thread
	 * @since 0.10.0
	 * @param channelId Id of the Channel or thread to send a message to
	 * @param data Buffer of the audio file to send. Tested file types are ogg, mp3, m4a, wav, flac. Other file types work, but some can only be embedded on mobile. Try it and see:tm:
	 * @param audioDurationSeconds The duration of the audio file in seconds
	 * @param waveform A preview of the entire voice message, with 1 byte per datapoint encoded in base64. Clients sample the recording at most once per 100 milliseconds, but will downsample so that no more than 256 datapoints are in the waveform. If you have no clue what you're doing, leave this as an empty string
	 * @returns non editable [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * | Permissions needed       | Condition                                                     |
	 * |--------------------------|---------------------------------------------------------------|
	 * | VIEW_CHANNEL             | if channel is not a DM channel                                |
	 * | READ_MESSAGE_HISTORY     | if channel is not a DM channel and message is a reply         |
	 * | SEND_MESSAGES            | if channel is not a DM channel and if channel is not a thread |
	 * | SEND_MESSAGES_IN_THREADS | if channel is a thread                                        |
	 *
	 * @example
	 * // Send a voice message that has a duration of 6 seconds
	 * const client = new SnowTransfer("TOKEN")
	 * // fileData will be a buffer with the data of the ogg audio
	 * const fileData = fs.readFileSync("6-second-long-audio.ogg") // You should probably use fs.promises.readFile, since it is asynchronous, synchronous methods block the thread.
	 * client.channel.createVoiceMessage("channel id", fileData, 6)
	 */
	// Code for this function was provided by flazepe on Discord. Thank you <3 https://github.com/flazepe
	public async createVoiceMessage(channelId: string, data: Buffer, audioDurationSeconds: number, waveform = ""): Promise<RESTPostAPIChannelMessageResult> {
		// create attachment
		const { upload_url, upload_filename } = await this.requestHandler.request(Endpoints.CHANNEL_ATTACHMENTS(channelId), {}, "post", "json", {
			files: [{
				id: "69420",
				filename: "voice-message.ogg",
				file_size: data.byteLength
			}]
		}).then(d => d.attachments[0]);

		// upload file to cdn
		await fetch(upload_url, { method: "PUT", body: data });

		// Actually send the voice message
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), {}, "post", "json", {
			attachments: [{
				id: "42069",
				uploaded_filename: upload_filename,
				filename: "voice-message.ogg",
				duration_secs: audioDurationSeconds,
				waveform
			}],
			flags: 1 << 13 // voice message flag
		});
	}

	/**
	 * Crosspost a message in a news channel to all following channels
	 * @since 0.3.0
	 * @param channelId Id of the news channel
	 * @param messageId Id of the message
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * | Permissions needed | Condition                                      |
	 * |--------------------|------------------------------------------------|
	 * | VIEW_CHANNEL       | always                                         |
	 * | SEND_MESSAGES      | if the message was sent by the current user    |
	 * | MANAGE_MESSAGES    | if the message wasn't sent by the current user |
	 *
	 * @example
	 * // Crosspost a message
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.crosspostMessage("channel id", "message id")
	 */
	public async crosspostMessage(channelId: string, messageId: string): Promise<RESTPostAPIChannelMessageCrosspostResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_CROSSPOST(channelId, messageId), {}, "post", "json");
	}

	/**
	 * Adds a reaction to a message
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param emoji uri encoded reaction emoji to add
	 * you may either use a discord emoji in the format `:emoji_name:emoji_id` or a unicode emoji,
	 * which can be found [here](http://www.unicode.org/emoji/charts/full-emoji-list.html)
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed   | Condition                                                                          |
	 * |----------------------|------------------------------------------------------------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel                                                     |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel                                                     |
	 * | ADD_REACTIONS        | When no other user has reacted with the emoji used and channel is not a DM channel |
	 *
	 * @example
	 * // This example uses a discord emoji
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.createReaction("channel Id", "message Id", encodeURIComponent("awooo:322522663304036352"))
	 *
	 * @example
	 * // using a utf-8 emoji
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.createReaction("channel Id", "message Id", encodeURIComponent("😀"))
	 */
	public async createReaction(channelId: string, messageId: string, emoji: string): Promise<RESTPutAPIChannelMessageReactionResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), {}, "put", "json") as RESTPutAPIChannelMessageReactionResult;
	}

	/**
	 * Delete a reaction added by the current user from a message
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param emoji reaction emoji
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permission           | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 *
	 * @example
	 * // This example uses a discord emoji
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteReactionSelf("channel Id", "message Id", encodeURIComponent("awooo:322522663304036352"))
	 *
	 * @example
	 * // using a utf-8 emoji
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteReactionSelf("channel Id", "message Id", encodeURIComponent("😀"))
	 */
	public async deleteReactionSelf(channelId: string, messageId: string, emoji: string): Promise<RESTDeleteAPIChannelMessageUserReactionResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), {}, "delete", "json") as RESTDeleteAPIChannelMessageUserReactionResult;
	}

	/**
	 * Delete a reaction from a message in a guild channel
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param messageId Id of the message
	 * @param emoji reaction emoji
	 * @param userId Id of the user
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permission           | Condition |
	 * |----------------------|-----------|
	 * | MANAGE_MESSAGES      | always    |
	 * | VIEW_CHANNEL         | always    |
	 * | READ_MESSAGE_HISTORY | always    |
	 *
	 * @example
	 * // This example uses a discord emoji
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteReaction("channel Id", "message Id", encodeURIComponent("awooo:322522663304036352"), "user Id")
	 *
	 * @example
	 * // using a utf-8 emoji
	 * const client = new SnowTransfer("TOKEN")
	 * // If a user Id is not supplied, the emoji from that message will be removed for all users
	 * client.channel.deleteReaction("channel Id", "message Id", encodeURIComponent("😀"))
	 */
	public async deleteReaction(channelId: string, messageId: string, emoji: string): Promise<RESTDeleteAPIChannelMessageReactionResult>;
	public async deleteReaction(channelId: string, messageId: string, emoji: string, userId: string): Promise<RESTDeleteAPIChannelMessageUserReactionResult>;
	public async deleteReaction(channelId: string, messageId: string, emoji: string, userId?: string): Promise<RESTDeleteAPIChannelMessageReactionResult | RESTDeleteAPIChannelMessageUserReactionResult> {
		return this.requestHandler.request(userId ? Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId) : Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), {}, "delete", "json") as never;
	}

	/**
	 * Get a list of users that reacted with a certain emoji on a certain message
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param emoji reaction emoji
	 * @param options Options for getting users
	 * @returns Array of [user objects](https://discord.com/developers/docs/resources/user#user-object)
	 *
	 * | Permissions needed   | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 *
	 * @example
	 * // This example uses a discord emoji
	 * const client = new SnowTransfer("TOKEN")
	 * const reactions = await client.channel.getReactions("channel Id", "message Id", encodeURIComponent("awooo:322522663304036352"))
	 */
	public async getReactions(channelId: string, messageId: string, emoji: string, options?: RESTGetAPIChannelMessageReactionUsersQuery): Promise<RESTGetAPIChannelMessageReactionUsersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), options, "get", "json");
	}

	/**
	 * Delete all reactions from a message in a guild channel
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param messageId Id of the message
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed   | Condition |
	 * |----------------------|-----------|
	 * | VIEW_CHANNEL         | always    |
	 * | READ_MESSAGE_HISTORY | always    |
	 * | MANAGE_MESSAGES      | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteAllReactions("channel Id", "message Id")
	 */
	public async deleteAllReactions(channelId: string, messageId: string): Promise<RESTDeleteAPIChannelAllMessageReactionsResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), {}, "delete", "json") as RESTDeleteAPIChannelAllMessageReactionsResult;
	}

	/**
	 * Edit a message sent by the current user or edit the message flags of another user's message
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param data Data to send
	 * @param options Options for editing this message
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * | Permissions needed | Condition                                        |
	 * |--------------------|--------------------------------------------------|
	 * | VIEW_CHANNEL       | if channel is not a DM channel                   |
	 * | MANAGE_MESSAGES    | When editing someone else's message to set flags |
	 *
	 * @example
	 * // Simple ping response
	 * const client = new SnowTransfer("TOKEN")
	 * const time = Date.now()
	 * const message = await client.channel.createMessage("channel id", "pong")
	 * client.channel.editMessage("channel id", message.id, `pong ${Date.now() - time}ms`)
	 */
	public async editMessage(channelId: string, messageId: string, data: string | RESTPatchAPIChannelMessageJSONBody & { files?: Array<{ name: string; file: Buffer | Readable | ReadableStream; }> }, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<RESTPatchAPIChannelMessageResult> {
		if (typeof data === "string") data = { content: data };

		// Sanitize the message
		if (data.content && (options.disableEveryone ?? this.disableEveryone)) data.content = Constants.replaceEveryone(data.content);

		if (data.files) return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), {}, "patch", "multipart", await Constants.standardMultipartHandler(data as Parameters<typeof Constants["standardMultipartHandler"]>["0"]));
		else return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), {}, "patch", "json", data);
	}

	/**
	 * Delete a message
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param reason Reason for deleting the message
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                                    |
	 * |--------------------|----------------------------------------------|
	 * | VIEW_CHANNEL       | if channel is not a DM channel               |
	 * | MANAGE_MESSAGES    | When the bot isn't the author of the message |
	 *
	 * @example
	 * // Delete a message
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteMessage("channel id", "message id")
	 */
	public async deleteMessage(channelId: string, messageId: string, reason?: string): Promise<RESTDeleteAPIChannelMessageResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), {}, "delete", "json", { reason }) as RESTDeleteAPIChannelMessageResult;
	}

	/**
	 * Bulk delete messages from a guild channel, messages may not be older than 2 weeks
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param messages array of message ids to delete
	 * @param reason Reason for deleting the messages
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | VIEW_CHANNEL       | always    |
	 * | MANAGE_MESSAGES    | always    |
	 *
	 * @example
	 * // Bulk deletes 2 messages with a reason of "spam"
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.bulkDeleteMessages("channel id", ["message id 1", "message id 2"], "spam")
	 */
	public async bulkDeleteMessages(channelId: string, messages: Array<string>, reason?: string): Promise<RESTPostAPIChannelMessagesBulkDeleteResult> {
		if (messages.length < Constants.BULK_DELETE_MESSAGES_MIN || messages.length > Constants.BULK_DELETE_MESSAGES_MAX) throw new RangeError(`Amount of messages to be deleted has to be between ${Constants.BULK_DELETE_MESSAGES_MIN} and ${Constants.BULK_DELETE_MESSAGES_MAX}`);
		// (Current date - (discord epoch + 2 weeks)) * (2**22) weird constant that everybody seems to use
		const oldestSnowflake = BigInt(Date.now() - 1421280000000) * (BigInt(2) ** BigInt(22));
		const forbiddenMessage = messages.find(m => BigInt(m) < oldestSnowflake);
		if (forbiddenMessage) throw new Error(`The message ${forbiddenMessage} is older than 2 weeks and may not be deleted using the bulk delete endpoint`);
		const data = { messages };
		if (reason) Object.assign(data, { reason });
		return this.requestHandler.request(Endpoints.CHANNEL_BULK_DELETE(channelId), {}, "post", "json", data) as RESTPostAPIChannelMessagesBulkDeleteResult;
	}

	/**
	 * Modify the permission overwrites of a guild channel
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param permissionId Id of the permission overwrite
	 * @param data modified [permission overwrite](https://discord.com/developers/docs/resources/channel#edit-channel-permissions-json-params) object
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                  |
	 * |--------------------|----------------------------|
	 * | MANAGE_CHANNELS    | if channel is not a thread |
	 * | MANAGE_THREADS     | if channel is a thread     |
	 * | MANAGE_ROLES       | always                     |
	 * | VIEW_CHANNEL       | always                     |
	 *
	 * @example
	 * // Edits the permissions of a user to allow viewing the channel only
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.editChannelPermission("channel id", "user id", { allow: String(1 << 10), type: 1 })
	 */
	public async editChannelPermission(channelId: string, permissionId: string, data: RESTPutAPIChannelPermissionJSONBody & { reason?: string; }): Promise<RESTPutAPIChannelPermissionResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), {}, "put", "json", data) as RESTPutAPIChannelPermissionResult;
	}

	/**
	 * Get a list of invites for a guild channel
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @returns Array of [invite objects](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | VIEW_CHANNEL       | always    |
	 * | MANAGE_CHANNELS    | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const invites = await client.channel.getChannelInvites("channel id")
	 */
	public async getChannelInvites(channelId: string): Promise<RESTGetAPIChannelInvitesResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), {}, "get", "json");
	}

	/**
	 * Create an invite for a guild channel
	 *
	 * If no data argument is passed, the invite will be created with the defaults
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param data invite data (optional)
	 * @returns [Invite object](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
	 *
	 * | Permissions needed    | Condition |
	 * |-----------------------|-----------|
	 * | VIEW_CHANNEL          | always    |
	 * | CREATE_INSTANT_INVITE | always    |
	 *
	 * @example
	 * // Creates a unique permanent invite with infinite uses
	 * const client = new SnowTransfer("TOKEN")
	 * const invite = await client.channel.createChannelInvite("channel id", { max_age: 0, max_uses: 0, unique: true })
	 */
	public async createChannelInvite(channelId: string, data: RESTPostAPIChannelInviteJSONBody & { reason?: string; } = { max_age: 86400, max_uses: 0, temporary: false, unique: false }): Promise<RESTPostAPIChannelInviteResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), {}, "post", "json", data);
	}

	/**
	 * Delete a permission overwrite from a guild channel
	 * @since 0.1.0
	 * @param channelId Id of the guild channel
	 * @param permissionId Id of the permission overwrite
	 * @param reason Reason for deleting the permission
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                  |
	 * |--------------------|----------------------------|
	 * | MANAGE_CHANNELS    | if channel is not a thread |
	 * | MANAGE_THREADS     | if channel is a thread     |
	 * | MANAGE_ROLES       | always                     |
	 * | VIEW_CHANNEL       | always                     |
	 *
	 * @example
	 * // Deletes the permission overwrite of a user
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.deleteChannelPermission("channel id", "user id", "Abusing channel")
	 */
	public async deleteChannelPermission(channelId: string, permissionId: string, reason?: string): Promise<RESTDeleteAPIChannelPermissionResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), {}, "delete", "json", { reason }) as RESTDeleteAPIChannelPermissionResult;
	}

	/**
	 * Follow an announcement channel to another channel
	 * @since 0.7.0
	 * @param channelId The Id of the announcement channel
	 * @param webhookChannelId The Id of the channel messages will be sent to
	 * @returns A [followed channel](https://discord.com/developers/docs/resources/channel#followed-channel-object) object
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Follows an announcement channel to a text channel
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.followAnnouncementChannel("news channel id", "text channel id")
	 */
	public async followAnnouncementChannel(channelId: string, webhookChannelId: string): Promise<RESTPostAPIChannelFollowersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_FOLLOWERS(channelId), {}, "post", "json", { webhook_channel_id: webhookChannelId });
	}

	/**
	 * Send an indicator that the current user is typing within a channel.
	 *
	 * **You should generally avoid this method unless used for longer computations (>1s)**
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed       | Condition                      |
	 * |--------------------------|--------------------------------|
	 * | VIEW_CHANNEL             | if channel is not a DM channel |
	 * | SEND_MESSAGES            | if channel is not a thread     |
	 * | SEND_MESSAGES_IN_THREADS | if channel is a thread         |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.sendChannelTyping("channel id")
	 */
	public async startChannelTyping(channelId: string): Promise<RESTPostAPIChannelTypingResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_TYPING(channelId), {}, "post", "json") as RESTPostAPIChannelTypingResult;
	}

	/**
	 * Get a list of pinned messages for a channel
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @returns Array of [message objects](https://discord.com/developers/docs/resources/channel#message-object)
	 *
	 * | Permissions needed   | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const messages = await client.channel.getPinnedMessages("channel id")
	 */
	public async getChannelPinnedMessages(channelId: string): Promise<RESTGetAPIChannelPinsResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_PINS(channelId), {}, "get", "json");
	}

	/**
	 * Pin a message within a channel
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param reason Reason for pinning the message
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed   | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 * | MANAGE_MESSAGES      | if channel is not a DM channel |
	 *
	 * @example
	 * // Pin a message because it was a good meme
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.addChannelPinnedMessage("channel id", "message id", "Good meme")
	 */
	public async addChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<RESTPutAPIChannelPinResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), {}, "put", "json", { reason }) as RESTPutAPIChannelPinResult;
	}

	/**
	 * Remove a pinned message from a channel
	 * @since 0.1.0
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param reason Reason for removing the pinned message
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed   | Condition                      |
	 * |----------------------|--------------------------------|
	 * | VIEW_CHANNEL         | if channel is not a DM channel |
	 * | READ_MESSAGE_HISTORY | if channel is not a DM channel |
	 * | MANAGE_MESSAGES      | if channel is not a DM channel |
	 *
	 * @example
	 * // Remove a pinned message because mod abuse :(
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.removeChannelPinnedMessage("channel id", "message id", "Mod abuse")
	 */
	public async removeChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<RESTDeleteAPIChannelPinResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), {}, "delete", "json", { reason }) as RESTDeleteAPIChannelPinResult;
	}

	/**
	 * Creates a public thread off a message in a guild channel
	 * @since 0.3.0
	 * @param channelId Id of the guild channel
	 * @param messageId Id of the message
	 * @param options Thread meta data
	 * @returns [thread channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * | Permissions needed    | Condition |
	 * |-----------------------|-----------|
	 * | VIEW_CHANNEL          | always    |
	 * | CREATE_PUBLIC_THREADS | always    |
	 *
	 * @example
	 * // Create a thread off a cool art piece to discuss
	 * const client = new SnowTransfer("TOKEN")
	 * const thread = await client.channel.createThreadWithMessage("channel id", "message id", { name: "cool-art", reason: "I wanna talk about it!" })
	 */
	public async createThreadWithMessage(channelId: string, messageId: string, options: RESTPostAPIChannelMessagesThreadsJSONBody & { reason?: string; }): Promise<RESTPostAPIChannelMessagesThreadsResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_THREADS(channelId, messageId), {}, "post", "json", options);
	}

	/**
	 * Creates a thread under a guild channel without a message
	 * @since 0.3.0
	 * @param channelId Id of the guild channel
	 * @param options Thread meta data
	 * @returns [thread channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * | Permissions needed     | Condition                    |
	 * |------------------------|------------------------------|
	 * | VIEW_CHANNEL           | always                       |
	 * | CREATE_PUBLIC_THREADS  | if creating a public thread  |
	 * | CREATE_PRIVATE_THREADS | if creating a private thread |
	 *
	 * @example
	 * // Creates a private thread that's invitable to talk about someone's birthday
	 * const client = new SnowTransfer("TOKEN")
	 * const thread = await client.channel.createThreadWithoutMessage("channel id", { name: "persons-birthday", type: 12, invitable: true, reason: "Shh! It's a surprise" })
	 */
	public async createThreadWithoutMessage(channelId: string, options: Omit<RESTPostAPIChannelThreadsJSONBody, "type"> & { type: 10; reason?: string; }): Promise<APITextBasedChannel<ChannelType.AnnouncementThread>>;
	public async createThreadWithoutMessage(channelId: string, options: Omit<RESTPostAPIChannelThreadsJSONBody, "type"> & { type: 11; reason?: string; }): Promise<APITextBasedChannel<ChannelType.PublicThread>>;
	public async createThreadWithoutMessage(channelId: string, options: Omit<RESTPostAPIChannelThreadsJSONBody, "type"> & { type: 12; reason?: string; }): Promise<APITextBasedChannel<ChannelType.PrivateThread>>;
	public async createThreadWithoutMessage(channelId: string, options: RESTPostAPIChannelThreadsJSONBody & { reason?: string; }): Promise<APITextBasedChannel<ChannelType.PublicThread | ChannelType.PrivateThread | ChannelType.AnnouncementThread>> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREADS(channelId), {}, "post", "json", options);
	}

	/**
	 * Join a thread
	 * @since 0.3.0
	 * @param threadId Id of the thread
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | VIEW_CHANNEL       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.joinThread("thread id")
	 */
	public async joinThread(threadId: string): Promise<RESTPutAPIChannelThreadMembersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, "@me"), {}, "put", "json") as RESTPutAPIChannelThreadMembersResult;
	}

	/**
	 * Add a user to a thread
	 *
	 * CurrentUser must be a member of the thread
	 * @since 0.3.0
	 * @param threadId Id of the thread
	 * @param userId Id of the user to add
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed          | Condition |
	 * |-----------------------------|-----------|
	 * | CurrentUser added to Thread | always    |
	 * | SEND_MESSAGES_IN_THREADS    | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.addThreadMember("thread id", "user id")
	 */
	public async addThreadMember(threadId: string, userId: string): Promise<RESTPutAPIChannelThreadMembersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), {}, "put", "json") as RESTPutAPIChannelThreadMembersResult;
	}

	/**
	 * Leave a thread
	 * @since 0.3.0
	 * @param threadId Id of the thread
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.leaveThread("thread id")
	 */
	public async leaveThread(threadId: string): Promise<RESTDeleteAPIChannelThreadMembersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, "@me"), {}, "delete", "json") as RESTDeleteAPIChannelThreadMembersResult;
	}

	/**
	 * Remove a user from a thread
	 * @since 0.3.0
	 * @param threadId Id of the thread
	 * @param userId Id of the user to remove
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                                            |
	 * |--------------------|------------------------------------------------------|
	 * | MANAGE_THREADS     | if the current user is not the creator of the thread |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.removeThreadMember("thread id", "user id")
	 */
	public async removeThreadMember(threadId: string, userId: string): Promise<RESTDeleteAPIChannelThreadMembersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), {}, "delete", "json") as RESTDeleteAPIChannelThreadMembersResult;
	}

	/**
	 * Gets a member of a thread
	 * @since 0.3.0
	 * @param threadId Id of the thread
	 * @param userId Id of the user
	 * @param withMember If a member object should be present
	 * @returns A [thread member](https://discord.com/developers/docs/resources/channel#thread-member-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | VIEW_CHANNEL       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const member = await client.channel.getThreadMember("thread id", "user id")
	 */
	public async getThreadMember(threadId: string, userId: string, withMember?: boolean): Promise<RESTGetAPIChannelThreadMemberResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), { with_member: withMember }, "get", "json");
	}

	/**
	 * Gets all members within a thread
	 * @since 0.3.0
	 * @param channelId Id of the Thread
	 * @param options Options for getting members
	 * @returns Array of [thread members](https://discord.com/developers/docs/resources/channel#thread-member-object)
	 *
	 * | Permissions needed           | Condition |
	 * |------------------------------|-----------|
	 * | VIEW_CHANNEL                 | always    |
	 *
	 * | Intents       |
	 * |---------------|
	 * | GUILD_MEMBERS |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const members = await client.channel.getThreadMembers("thread id")
	 */
	public async getThreadMembers(channelId: string, options?: RESTGetAPIChannelThreadMembersQuery): Promise<RESTGetAPIChannelThreadMembersResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBERS(channelId), options, "get", "json");
	}

	/**
	 * Gets all threads that are public and archived within a guild channel
	 * @since 0.3.0
	 * @param channelId Id of the guild channel
	 * @param options Options for getting threads
	 * @returns Object containing [public threads](https://discord.com/developers/docs/resources/channel#channel-object), [thread members](https://discord.com/developers/docs/resources/channel#thread-member-object) of the CurrentUser, and if there are more results in the pagination
	 *
	 * | Permissions needed          | Condition |
	 * |-----------------------------|-----------|
	 * | VIEW_CHANNEL                | always    |
	 * | READ_MESSAGE_HISTORY        | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.channel.getChannelArchivedPublicThreads("channel id")
	 */
	public async getChannelArchivedPublicThreads(channelId: string, options?: RESTGetAPIChannelThreadsArchivedQuery): Promise<RESTGetAPIChannelThreadsArchivedPublicResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREADS_ARCHIVED_PUBLIC(channelId), options, "get", "json");
	}

	/**
	 * Gets all threads that are private and archived within a guild channel
	 *
	 * CurrentUser must be a member of the thread if they do not have MANAGE_THREADS permissions
	 * @since 0.3.0
	 * @param channelId Id of the Channel
	 * @param options Options for getting threads
	 * @returns Object containing [private threads](https://discord.com/developers/docs/resources/channel#channel-object), [thread members](https://discord.com/developers/docs/resources/channel#thread-member-object) of the CurrentUser, and if there are more results in the pagination
	 *
	 * | Permissions needed          | Condition                            |
	 * |-----------------------------|--------------------------------------|
	 * | VIEW_CHANNEL                | always                               |
	 * | READ_MESSAGE_HISTORY        | always                               |
	 * | MANAGE_THREADS              | if CurrentUser isn't added to Thread |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.channel.getChannelArchivedPrivateThreads("channel id")
	 */
	public async getChannelArchivedPrivateThreads(channelId: string, options?: RESTGetAPIChannelThreadsArchivedQuery): Promise<RESTGetAPIChannelThreadsArchivedPrivateResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREADS_ARCHIVED_PRIVATE(channelId), options, "get", "json");
	}

	/**
	 * Gets all threads that are private and archived within a guild channel that the CurrentUser is apart of
	 *
	 * CurrentUser must be a member of the thread if they do not have MANAGE_THREADS permissions
	 * @since 0.3.0
	 * @param channelId Id of the Channel
	 * @param options Option for getting threads
	 * @returns Object containing [private threads](https://discord.com/developers/docs/resources/channel#channel-object), [thread members](https://discord.com/developers/docs/resources/channel#thread-member-object) of the CurrentUser, and if there are more results in the pagination
	 *
	 * | Permissions needed                | Condition                                  |
	 * |-----------------------------------|--------------------------------------------|
	 * | VIEW_CHANNEL                      | always                                     |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.channel.getChannelArchivedPrivateThreadsUser("channel id")
	 */
	public async getChannelArchivedPrivateThreadsUser(channelId: string, options?: RESTGetAPIChannelThreadsArchivedQuery): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREADS_ARCHIVED_PRIVATE_USER(channelId), options, "get", "json");
	}

	/**
	 * Refreshes Discord CDN attachments by URL to give you non-expired links. This also works on attachments the token may not have access to through means like guild bot presence
	 * @since 0.10.7
	 * @param attachments A list of Discord CDN attachment URLs. Does not require the URL(s) to have the expiration info parameters
	 * @returns Object containing a list of the original URLs inputted and refreshed URLs
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.channel.refreshAttachmentURLs("https://cdn.discordapp.com/attachments/1109362097952931840/1277799507911905280/traveler.gif")
	 */
	public async refreshAttachmentURLs(attachments: string | Array<string>): Promise<RESTPostAPIAttachmentsRefreshURLsResult> {
		return this.requestHandler.request(Endpoints.ATTACHMENTS_REFRESH_URLS, {}, "post", "json", {
			attachment_urls: Array.isArray(attachments) ? attachments : [attachments]
		})
	}
}

export = ChannelMethods;


// Wolke >>
// https://www.youtube.com/watch?v=LIlZCmETvsY have a weird video to distract yourself from the problems that will come upon ya

// PapiOphidian >>
// Thanks, Wolke :)
