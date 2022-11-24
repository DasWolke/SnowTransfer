import Endpoints = require("../Endpoints");

/**
 * Methods for interacting with users
 */
class UserMethods {
	public requestHandler: (typeof import("../RequestHandler"))["RequestHandler"]["prototype"];

	/**
	 * Create a new User Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.user.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler
	 */
	public constructor(requestHandler: UserMethods["requestHandler"]) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get information about the CurrentUser
	 * @returns A [user object](https://discord.com/developers/docs/resources/user#user-object)
	 *
	 * | OAUTH2 Scopes | Condition     |
	 * |---------------|---------------|
	 * | identify      | Without email |
	 * | email         | With email    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const self = await client.user.getSelf()
	 */
	public async getSelf(): Promise<import("discord-typings").User> {
		return this.requestHandler.request(Endpoints.USER("@me"), "get", "json");
	}

	/**
	 * Get information about a user via Id
	 * @param userId Id of the user
	 * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const user = await client.user.getUser("userId")
	 */
	public async getUser(userId: string): Promise<import("discord-typings").User> {
		return this.requestHandler.request(Endpoints.USER(userId), "get", "json");
	}

	/**
	 * Update the current user
	 * @param data The new data of the CurrentUser
	 * @returns [user object](https://discord.com/developers/docs/resources/user#user-object)
	 *
	 * @example
	 * // update the avatar of the user
	 * const client = new SnowTransfer("TOKEN")
	 * const fileData = fs.readFileSync("new_avatar.png") // You should probably use fs.readFile, since it is asynchronous, synchronous methods may lag your bot.
	 * const updateData = \{
	 * 	avatar: `data:image/png;base64,${fileData.toString("base64")}` // base64 data url: data:mimetype;base64,base64String
	 * \}
	 * client.user.updateSelf(updateData)
	 */
	public async updateSelf(data: { username?: string; avatar?: string | null; }): Promise<import("discord-typings").User> {
		return this.requestHandler.request(Endpoints.USER("@me"), "patch", "json", data);
	}

	/**
	 * Get guilds of the current user
	 * @returns Array of [partial guild objects](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const guilds = await client.user.getGuilds()
	 */
	public async getGuilds(query?: { before?: string; after?: string; limit?: number; }): Promise<Array<import("discord-typings").Guild>> {
		return this.requestHandler.request(`${Endpoints.USER_GUILDS("@me")}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}

	/**
	 * Leaves a guild
	 * @param guildId Id of the guild
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.user.leaveGuild("guildId")
	 */
	public async leaveGuild(guildId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.USER_GUILD("@me", guildId), "delete", "json");
	}

	/**
	 * Create a direct message channel with another user
	 *
	 * **You can not create a dm with another bot**
	 * @param userId Id of the user to create the direct message channel with
	 * @returns A [DM channel](https://discord.com/developers/docs/resources/channel#channel-object)
	 *
	 * @example
	 * // Create a dm channel and send "hi" to it
	 * const client = new SnowTransfer("TOKEN")
	 * const channel = await client.user.createDirectMessageChannel("other user id")
	 * client.channel.createMessage(channel.id, "hi")
	 */
	public async createDirectMessageChannel(userId: string): Promise<import("discord-typings").DMChannel> {
		return this.requestHandler.request(Endpoints.USER_CHANNELS("@me"), "post", "json", { recipient_id: userId });
	}
}

export = UserMethods;
