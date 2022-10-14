import Endpoints from "../Endpoints";
import Constants from "../Constants";

const mentionRegex = /@([^<>@ ]*)/gsmu;

/**
 * Methods for interacting with Channels and Messages
 */
class ChannelMethods {
	public requestHandler: import("../RequestHandler");
	public disableEveryone: boolean;

	public static default = ChannelMethods;

	/**
	 * Create a new Channel Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.channel.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
	 */
	public constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean) {
		this.requestHandler = requestHandler;
		this.disableEveryone = disableEveryone;
	}

	/**
	 * Get a channel via Id
	 * @param channelId Id of the channel
	 * @returns [discord channel](https://discord.com/developers/docs/resources/channel#channel-object) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const channel = await client.channel.getChannel("channel id")
	 */
	public async getChannel(channelId: string): Promise<import("discord-typings").Channel> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), "get", "json");
	}

	/**
	 * Update a guild channel or thread
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
	public async updateChannel(channelId: string, data: EditChannelData & { reason?: string; }): Promise<import("discord-typings").GuildChannel>;
	public async updateChannel(channelId: string, data: EditThreadData & { reason?: string; }): Promise<import("discord-typings").ThreadChannel>;
	public async updateChannel(channelId: string, data: (EditChannelData | EditThreadData) & { reason?: string; }): Promise<import("discord-typings").GuildChannel | import("discord-typings").ThreadChannel> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), "patch", "json", data);
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
	public async deleteChannel(channelId: string, reason?: string): Promise<import("discord-typings").Channel> {
		return this.requestHandler.request(Endpoints.CHANNEL(channelId), "delete", "json", reason ? { reason } : undefined);
	}

	/**
	 * Get a list of messages from a channel
	 * @param channelId Id of the channel
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
	public async getChannelMessages(channelId: string, options: GetMessageOptions = { limit: 50 }): Promise<Array<import("discord-typings").Message>> {
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
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), "get", "json", options);
	}

	/**
	 * Get a single message via Id
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
	public async getChannelMessage(channelId: string, messageId: string): Promise<import("discord-typings").Message> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), "get", "json");
	}

	/**
	 * Creates a new Message within a channel or thread
	 *
	 * **Make sure to use a filename with a proper extension (e.g. png, jpeg, etc.) when you want to upload files**
	 * @param channelId Id of the Channel or thread to sent a message to
	 * @param data Data to send, if data is a string it will be used as the content of the message,
	 * if data is not a string you should take a look at the properties below to know what you may send
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
	 * const fileData = fs.readFileSync("nice_picture.png") // You should probably use fs.readFile, since it is asynchronous, synchronous methods block the thread.
	 * client.channel.createMessage("channel id", { content: "This is a nice picture", files: [{ name: "Optional_Filename.png", file: fileData }] })
	 */
	public async createMessage(channelId: string, data: string | CreateMessageData, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<import("discord-typings").Message> {
		if (typeof data !== "string" && !data.content && !data.embeds && !data.files) throw new Error("Missing content, embeds, files");
		if (typeof data === "string") data = { content: data };

		// Sanitize the message
		if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) data.content = data.content.replace(mentionRegex, replaceEveryone);

		if (data.files) return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), "post", "multipart", data);
		else return this.requestHandler.request(Endpoints.CHANNEL_MESSAGES(channelId), "post", "json", data);
	}

	/**
	 * Crosspost a message in a news channel to all following channels
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
	public async crosspostMessage(channelId: string, messageId: string): Promise<import("discord-typings").Message> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_CROSSPOST(channelId, messageId), "post", "json");
	}

	/**
	 * Adds a reaction to a message
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
	public async createReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), "put", "json");
	}

	/**
	 * Delete a reaction added by the current user from a message
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
	public async deleteReactionSelf(channelId: string, messageId: string, emoji: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, "@me"), "delete", "json");
	}

	/**
	 * Delete a reaction from a message in a guild channel
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
	public async deleteReaction(channelId: string, messageId: string, emoji: string, userId?: string): Promise<void> {
		if (!userId) return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji), "delete", "json");
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, emoji, userId), "delete", "json");
	}

	/**
	 * Get a list of users that reacted with a certain emoji on a certain message
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param emoji reaction emoji
	 * @param query Options for getting users
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
	public async getReactions(channelId: string, messageId: string, emoji: string, query?: { after?: string; limit?: number; }): Promise<Array<import("discord-typings").User>> {
		return this.requestHandler.request(`${Endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, emoji)}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}

	/**
	 * Delete all reactions from a message in a guild channel
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
	public async deleteAllReactions(channelId: string, messageId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId), "delete", "json");
	}

	/**
	 * Edit a message sent by the current user or edit the message flags of another user's message
	 * @param channelId Id of the channel
	 * @param messageId Id of the message
	 * @param data Data to send
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
	public async editMessage(channelId: string, messageId: string, data: string | EditMessageData, options: { disableEveryone?: boolean; } = { disableEveryone: this.disableEveryone }): Promise<import("discord-typings").Message> {
		if (typeof data !== "string" && data.content === undefined && data.embeds === undefined && data.files === undefined) throw new Error("Missing content, embeds, or files");
		if (typeof data === "string") data = { content: data };

		// Sanitize the message
		if (data.content && (options.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) data.content = data.content.replace(mentionRegex, replaceEveryone);

		if (data.files) return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), "patch", "multipart", data);
		else return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), "patch", "json", data);
	}

	/**
	 * Delete a message
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
	public async deleteMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE(channelId, messageId), "delete", "json", reason ? { reason } : undefined);
	}

	/**
	 * Bulk delete messages from a guild channel, messages may not be older than 2 weeks
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
	public async bulkDeleteMessages(channelId: string, messages: Array<string>, reason?: string): Promise<void> {
		if (messages.length < Constants.BULK_DELETE_MESSAGES_MIN || messages.length > Constants.BULK_DELETE_MESSAGES_MAX) throw new RangeError(`Amount of messages to be deleted has to be between ${Constants.BULK_DELETE_MESSAGES_MIN} and ${Constants.BULK_DELETE_MESSAGES_MAX}`);
		// (Current date - (discord epoch + 2 weeks)) * (2**22) weird constant that everybody seems to use
		const oldestSnowflake = BigInt(Date.now() - 1421280000000) * (BigInt(2) ** BigInt(22));
		const forbiddenMessage = messages.find(m => BigInt(m) < oldestSnowflake);
		if (forbiddenMessage) throw new Error(`The message ${forbiddenMessage} is older than 2 weeks and may not be deleted using the bulk delete endpoint`);
		const data = { messages };
		if (reason) Object.assign(data, { reason });
		return this.requestHandler.request(Endpoints.CHANNEL_BULK_DELETE(channelId), "post", "json", data);
	}

	/**
	 * Modify the permission overwrites of a guild channel
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
	public async editChannelPermission(channelId: string, permissionId: string, data: Partial<Omit<import("discord-typings").Overwrite, "id">> & { reason?: string; }): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), "put", "json", data);
	}

	/**
	 * Get a list of invites for a guild channel
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
	public async getChannelInvites(channelId: string): Promise<Array<import("discord-typings").Invite & import("discord-typings").InviteMetadata>> {
		return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), "get", "json");
	}

	/**
	 * Create an invite for a guild channel
	 *
	 * If no data argument is passed, the invite will be created with the defaults
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
	public async createChannelInvite(channelId: string, data: CreateInviteData & { reason?: string; } = { max_age: 86400, max_uses: 0, temporary: false, unique: false }): Promise<import("discord-typings").Invite> {
		return this.requestHandler.request(Endpoints.CHANNEL_INVITES(channelId), "post", "json", data);
	}

	/**
	 * Delete a permission overwrite from a guild channel
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
	public async deleteChannelPermission(channelId: string, permissionId: string, reason?: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_PERMISSION(channelId, permissionId), "delete", "json", reason ? { reason } : undefined);
	}

	/**
	 * Follow a news channel to another channel
	 * @param channelId The Id of the news channel
	 * @param webhookChannelId The Id of the channel messages will be sent to
	 * @returns A [followed channel](https://discord.com/developers/docs/resources/channel#followed-channel-object) object
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Follows a news channel to a text channel
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.followNewsChannel("news channel id", "text channel id")
	 */
	public async followNewsChannel(channelId: string, webhookChannelId: string): Promise<import("discord-typings").FollowedChannel> {
		return this.requestHandler.request(Endpoints.CHANNEL_FOLLOWERS(channelId), "post", "json", { webhook_channel_id: webhookChannelId });
	}

	/**
	 * Send an indicator that the current user is typing within a channel.
	 *
	 * **You should generally avoid this method unless used for longer computations (>1s)**
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
	public async startChannelTyping(channelId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_TYPING(channelId), "post", "json");
	}

	/**
	 * Get a list of pinned messages for a channel
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
	public async getChannelPinnedMessages(channelId: string): Promise<Array<import("discord-typings").Message>> {
		return this.requestHandler.request(Endpoints.CHANNEL_PINS(channelId), "get", "json");
	}

	/**
	 * Pin a message within a channel
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
	public async addChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), "put", "json", reason ? { reason } : undefined);
	}

	/**
	 * Remove a pinned message from a channel
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
	public async removeChannelPinnedMessage(channelId: string, messageId: string, reason?: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_PIN(channelId, messageId), "delete", "json", reason ? { reason } : undefined);
	}

	/**
	 * Creates a public thread off a message in a guild channel
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
	public async createThreadWithMessage(channelId: string, messageId: string, options: { name: string; auto_archive_duration?: 60 | 1440 | 4320 | 10080; rate_limit_per_user?: number | null; reason?: string; }): Promise<import("discord-typings").AnnouncementThread | import("discord-typings").PublicThread> {
		return this.requestHandler.request(Endpoints.CHANNEL_MESSAGE_THREADS(channelId, messageId), "post", "json", options);
	}

	/**
	 * Creates a thread under a guild channel without a message
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
	public async createThreadWithoutMessage(channelId: string, options: { name: string; auto_archive_duration?: 60 | 1440 | 4320 | 10080; rate_limit_per_user?: number | null; type: 11; invitable?: boolean; reason?: string; }): Promise<import("discord-typings").PublicThread>;
	public async createThreadWithoutMessage(channelId: string, options: { name: string; auto_archive_duration?: 60 | 1440 | 4320 | 10080; rate_limit_per_user?: number | null; type: 12; invitable?: boolean; reason?: string; }): Promise<import("discord-typings").PrivateThread>;
	public async createThreadWithoutMessage(channelId: string, options: { name: string; auto_archive_duration?: 60 | 1440 | 4320 | 10080; rate_limit_per_user?: number | null; type: 11 | 12; invitable?: boolean; reason?: string; }): Promise<import("discord-typings").PublicThread | import("discord-typings").PrivateThread> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREADS(channelId), "post", "json", options);
	}

	/**
	 * Join a thread
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
	public async joinThread(threadId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, "@me"), "put", "json");
	}

	/**
	 * Add a user to a thread
	 *
	 * CurrentUser must be a member of the thread
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
	public async addThreadMember(threadId: string, userId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), "put", "json");
	}

	/**
	 * Leave a thread
	 * @param threadId Id of the thread
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.channel.leaveThread("thread id")
	 */
	public async leaveThread(threadId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, "@me"), "delete", "json");
	}

	/**
	 * Remove a user from a thread
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
	public removeThreadMember(threadId: string, userId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), "delete", "json");
	}

	/**
	 * Gets a member of a thread
	 * @param threadId Id of the thread
	 * @param userId Id of the user
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
	public async getThreadMember(threadId: string, userId: string): Promise<import("discord-typings").ThreadMember> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBER(threadId, userId), "get", "json");
	}

	/**
	 * Gets all members within a thread
	 * @param channelId Id of the Thread
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
	public async getThreadMembers(channelId: string): Promise<Array<import("discord-typings").ThreadMember>> {
		return this.requestHandler.request(Endpoints.CHANNEL_THREAD_MEMBERS(channelId), "get", "json");
	}

	/**
	 * Gets all threads that are public and archived within a guild channel
	 * @param channelId Id of the guild channel
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
	public async getChannelArchivedPublicThreads(channelId: string, query?: { before?: string; limit?: number; }): Promise<{ threads: Array<import("discord-typings").AnnouncementThread | import("discord-typings").PublicThread>; members: Array<import("discord-typings").ThreadMember>; has_more: boolean; }> {
		return this.requestHandler.request(`${Endpoints.CHANNEL_THREADS_ARCHIVED_PUBLIC(channelId)}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}

	/**
	 * Gets all threads that are private and archived within a guild channel
	 *
	 * CurrentUser must be a member of the thread if they do not have MANAGE_THREADS permissions
	 * @param channelId Id of the Channel
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
	public async getChannelArchivedPrivateThreads(channelId: string, query?: { before?: string; limit?: number; }): Promise<{ threads: Array<import("discord-typings").PrivateThread>; members: Array<import("discord-typings").ThreadMember>; has_more: boolean; }> {
		return this.requestHandler.request(`${Endpoints.CHANNEL_THREADS_ARCHIVED_PRIVATE(channelId)}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}

	/**
	 * Gets all threads that are private and archived within a guild channel that the CurrentUser is apart of
	 *
	 * CurrentUser must be a member of the thread if they do not have MANAGE_THREADS permissions
	 * @param channelId Id of the Channel
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
	public async getChannelArchivedPrivateThreadsUser(channelId: string, query?: { before?: string; limit?: number; }): Promise<{ threads: Array<import("discord-typings").PrivateThread>; members: Array<import("discord-typings").ThreadMember>; has_more: boolean; }> {
		return this.requestHandler.request(`${Endpoints.CHANNEL_THREADS_ARCHIVED_PRIVATE_USER(channelId)}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}
}

const isValidUserMentionRegex = /^[&!]?\d+$/;

function replaceEveryone(_match: string, target: string) {
	if (isValidUserMentionRegex.test(target)) return `@${target}`;
	else return `@\u200b${target}`;
}

interface EditChannelData {
	/**
	 * New name of the channel
	 */
	name?: string;
	/**
	 * The type of the channel. Only can convert between text and news channels.
	 * Only available in Guilds with the NEWS feature
	 */
	type?: 0 | 5;
	/**
	 * New position of the channel
	 */
	position?: number | null;
	/**
	 * New topic of the channel
	 */
	topic?: string | null;
	/**
	 * Update nsfw type of the channel
	 */
	nsfw?: boolean | null;
	/**
	 * amount of seconds a user has to wait before sending another message (0-21600).
	 * bots, as well as users with the permission MANAGE_MESSAGES or MANAGE_CHANNEL, are unaffected
	 */
	rate_limit_per_user?: number | null;
	/**
	 * Update bitrate of the channel
	 */
	bitrate?: number | null;
	/**
	 * Update the limit of users that are allowed to be in a channel
	 */
	user_limit?: number | null;
	/**
	 * Update the permission overwrites
	 */
	permission_overwrites?: Array<import("discord-typings").Overwrite> | null;
	/**
	 * Id of the parent category of the channel
	 */
	parent_id?: string | null;
	/**
	 * The region id for the voice channel. Automatic when set to null
	 */
	rtc_region?: string | null;
	/**
	 * The camera video quality mode.
	 */
	video_quality_mode?: 1 | 2 | null;
	/**
	 * The default value for timeouts clients use, in minutes, when creating threads before they become stale and are archived
	 */
	default_auto_archive_duration?: number | null;
}

interface EditThreadData {
	/**
	 * The new name of the thread
	 */
	name?: string;
	/**
	 * If the thread should be archived
	 */
	archived?: boolean;
	/**
	 * how long until the thread is automatically archived from the last message
	 */
	auto_archive_duration?: number;
	/**
	 * If the thread should be locked
	 */
	locked?: boolean;
	/**
	 * If only the thread creator can invite people or not
	 */
	invitable?: boolean;
	/**
	 * amount of seconds a user has to wait before sending another message (0-21600).
	 * bots, as well as users with the permission MANAGE_MESSAGES or MANAGE_CHANNEL, are unaffected
	 */
	rate_limit_per_user?: number;
}

interface GetMessageOptions {
	/**
	 * Gets messages around the Id of the passed snowflake
	 */
	around?: string;
	/**
	 * Gets messages before the Id of the passed snowflake
	 */
	before?: string;
	/**
	 * Gets messages after the Id of the passed snowflake
	 */
	after?: string;
	/**
	 * Number of messages to get, values between 1-100 allowed
	 */
	limit?: number;
}

interface CreateMessageData {
	/**
	 * Content of the message
	 */
	content?: string;
	/**
	 * if this message is text-to-speech
	 */
	tts?: boolean;
	/**
	 * Array of [Embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send
	 */
	embeds?: Array<import("discord-typings").Embed>;
	/**
	 * [Allowed mentions](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for the message
	 */
	allowed_mentions?: import("discord-typings").AllowedMentions;
	/**
	 * [Reply](https://discord.com/developers/docs/resources/channel#message-reference-object-message-reference-structure) to a message
	 */
	message_reference?: import("discord-typings").MessageReference;
	/**
	 * [Components](https://discord.com/developers/docs/interactions/message-components#component-object) to add to the message
	 */
	components?: Array<import("discord-typings").ActionRow>;
	/**
	 * Stickers to send
	 */
	sticker_ids?: Array<string>;
	/**
	 * Files that should be uploaded
	 */
	files?: Array<{
		/**
		 * Name of the file
		 */
		name: string;
		/**
		 * Buffer with file contents
		 */
		file: Buffer;
	}>;
	/**
	 * Attachments for embeds
	 */
	attachments?: Array<Omit<import("discord-typings").Attachment, "ephemeral" | "proxy_url" | "url" | "size">>;
	/**
	 * Flags (only SUPPRESS_EMBEDS can be set)
	 */
	flags?: number;
}

interface EditMessageData {
	/**
	 * Content of the message
	 */
	content?: string | null;
	/**
	 * Array of [Embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send
	 */
	embeds?: Array<import("discord-typings").Embed>;
	/**
	 * 1 << 2 to set a message SUPPRESS_EMBEDS
	 */
	flags?: number;
	/**
	 * [Allowed mentions](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for the message
	 */
	allowed_mentions?: import("discord-typings").AllowedMentions;
	/**
	 * [Components](https://discord.com/developers/docs/interactions/message-components#component-object) to add to the message
	 */
	components?: Array<import("discord-typings").ActionRow>;
	/**
	 * Files that should be updated
	 */
	files?: Array<{
		/**
		 * Name of the file
		 */
		name: string;
		/**
		 * Buffer with file contents
		 */
		file: Buffer;
	}>;
	/**
	 * [Attached files](https://discord.com/developers/docs/resources/channel#attachment-object) to remove or edit descriptions for
	 */
	attachments?: Array<Omit<import("discord-typings").Attachment, "ephemeral" | "proxy_url" | "url" | "size">>;
}

interface CreateInviteData {
	/**
	 * max age of the invite in seconds
	 */
	max_age?: number;
	/**
	 * max uses of the invite
	 */
	max_uses?: number;
	/**
	 * if this invite only allows temporary membership
	 */
	temporary?: boolean;
	/**
	 * does not try to re-use similar invites when true (useful for creating many one-time invites)
	 */
	unique?: boolean;
	/**
	 * The type of target for this voice channel invite
	 */
	target_type?: import("discord-typings").InviteTarget;
	/**
	 * User ID of who's stream to display in the voice channel. Required if target_type is 1. User must be streaming in the channel
	 */
	target_user_id?: string;
	/**
	 * ID of the application to open for this invite. Required if target_type is 2. The application must have the EMBEDDED flag.
	 */
	target_application_id?: string;
}

export = ChannelMethods;


// Wolke >>
// https://www.youtube.com/watch?v=LIlZCmETvsY have a weird video to distract yourself from the problems that will come upon ya

// PapiOphidian >>
// Thanks, Wolke :)
