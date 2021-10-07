import Endpoints from "../Endpoints";

/**
 * Methods for interacting with users
 */
class UserMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new User Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.user.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get information about current user
	 * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
	 */
	public async getSelf(): Promise<Required<import("discord-typings").UserData>> {
		return this.requestHandler.request(Endpoints.USER("@me"), "get", "json");
	}

	/**
	 * Get information about a user via Id
	 * @param userId Id of the user
	 * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
	 */
	public async getUser(userId: string): Promise<import("discord-typings").UserData> {
		return this.requestHandler.request(Endpoints.USER(userId), "get", "json");
	}

	/**
	 * Update the current user
	 * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
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
	public async updateSelf(data: { username?: string; avatar?: string; }): Promise<Required<import("discord-typings").UserData>> {
		return this.requestHandler.request(Endpoints.USER("@me"), "patch", "json", data);
	}

	/**
	 * Get guilds of the current user
	 * @returns Array of [partial guild objects](https://discord.com/developers/docs/resources/guild#guild-object)
	 */
	public async getGuilds(): Promise<Array<import("discord-typings").GuildData>> {
		return this.requestHandler.request(Endpoints.USER_GUILDS("@me"), "get", "json");
	}

	/**
	 * Leave a guild
	 * @param guildId Id of the guild
	 * @returns Resolves the Promise on successful execution
	 */
	public async leaveGuild(guildId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.USER_GUILD("@me", guildId), "delete", "json");
	}

	/**
	 * Get direct messages of a user
	 *
	 * **Returns an empty array for bots**
	 * @returns Array of [dm channels](https://discord.com/developers/docs/resources/channel#channel-object)
	 */
	public async getDirectMessages(): Promise<Array<import("discord-typings").DMChannelData>> {
		return this.requestHandler.request(Endpoints.USER_CHANNELS("@me"), "get", "json");
	}

	/**
	 * Create a direct message channel with another user
	 *
	 * **You can not create a dm with another bot**
	 * @param userId Id of the user to create the direct message channel with
	 * @returns [DM channel](https://discord.com/developers/docs/resources/channel#channel-object)
	 *
	 * @example
	 * // Create a dm channel and send "hi" to it
	 * let client = new SnowTransfer('TOKEN');
	 * let channel = await client.user.createDirectMessageChannel('other user id')
	 * client.channel.createMessage(channel.id, 'hi')
	 */
	public async createDirectMessageChannel(userId: string): Promise<import("discord-typings").DMChannelData> {
		return this.requestHandler.request(Endpoints.USER_CHANNELS("@me"), "post", "json", { recipient_id: userId });
	}
}

export = UserMethods;
