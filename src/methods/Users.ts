import Endpoints = require("../Endpoints");

import type {
	RESTDeleteAPICurrentUserGuildResult,
	RESTGetAPICurrentUserApplicationRoleConnectionResult,
	RESTGetAPICurrentUserConnectionsResult,
	RESTGetAPICurrentUserGuildsQuery,
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPICurrentUserResult,
	RESTGetAPIUserResult,
	RESTPatchAPICurrentUserJSONBody,
	RESTPatchAPICurrentUserResult,
	RESTPostAPICurrentUserCreateDMChannelResult,
	RESTPutAPICurrentUserApplicationRoleConnectionJSONBody,
	RESTPutAPICurrentUserApplicationRoleConnectionResult
} from "discord-api-types/v10";

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
	public async getSelf(): Promise<RESTGetAPICurrentUserResult> {
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
	public async getUser(userId: string): Promise<RESTGetAPIUserResult> {
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
	public async updateSelf(data: RESTPatchAPICurrentUserJSONBody): Promise<RESTPatchAPICurrentUserResult> {
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
	public async getGuilds(query?: RESTGetAPICurrentUserGuildsQuery): Promise<RESTGetAPICurrentUserGuildsResult> {
		return this.requestHandler.request(Endpoints.USER_GUILDS("@me"), "get", "json", query);
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
	public async leaveGuild(guildId: string): Promise<RESTDeleteAPICurrentUserGuildResult> {
		return this.requestHandler.request(Endpoints.USER_GUILD("@me", guildId), "delete", "json") as RESTDeleteAPICurrentUserGuildResult;
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
	public async createDirectMessageChannel(userId: string): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
		return this.requestHandler.request(Endpoints.USER_CHANNELS("@me"), "post", "json", { recipient_id: userId });
	}

	/**
	 * Create a group direct message channel with other users
	 *
	 * @param data An object containing a list of access tokens with gdm.join and optionally, a nickname dictionary keyed by user IDs with strings as values
	 * @returns A [DM channel](https://discord.com/developers/docs/resources/channel#channel-object)
	 *
	 * | OAUTH2 Scopes | Condition            |
	 * |---------------|----------------------|
	 * | gdm.join      | always for each user |
	 *
	 * @example
	 * // Create a group dm channel and send "hi" to it
	 * const client = new SnowTransfer("TOKEN")
	 * const channel = await client.user.createGroupDirectMessageChannel({ access_tokens: ["user 1 access token", "user 2 access token"], { "320067006521147393": "Brad", "128392910574977024": "Wolke" } })
	 * client.channel.createMessage(channel.id, "hi")
	 */
	public async createGroupDirectMessageChannel(data: { access_tokens: Array<string>; nicks?: { [userId: string]: string } }): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
		return this.requestHandler.request(Endpoints.USER_CHANNELS("@me"), "post", "json", data);
	}

	/**
	 * Returns a list of connections for the current user
	 * @returns A list of [connections](https://discord.com/developers/docs/resources/user#connection-object)
	 *
	 * | OAUTH2 Scopes | Condition |
	 * |---------------|-----------|
	 * | connections   | always    |
	 *
	 * @example
	 * // Get all user's connections
	 * const client = new SnowTransfer("TOKEN")
	 * const connections = await client.user.getConnections()
	 */
	public async getConnections(): Promise<RESTGetAPICurrentUserConnectionsResult> {
		return this.requestHandler.request(Endpoints.USER_CONNECTIONS("@me"), "get", "json");
	}

	/**
	 * Gets a role connection for the current user
	 * @param appId Id of the application
	 * @returns An [Application role connection](https://discord.com/developers/docs/resources/user#application-role-connection-object)
	 *
	 * | OAUTH2 Scopes          | Condition |
	 * |------------------------|-----------|
	 * | role_connections.write | always    |
	 *
	 * @example
	 * // Get a role connection for an app
	 * const client = new SnowTransfer("TOKEN")
	 * const connection = await client.user.getApplicationRoleConnection("app id")
	 */
	public async getApplicationRoleConnection(appId: string): Promise<RESTGetAPICurrentUserApplicationRoleConnectionResult> {
		return this.requestHandler.request(Endpoints.USER_APPLICATION_ROLE_CONNECTION("@me", appId), "get", "json");
	}

	/**
	 * Updates a role connection for the current user
	 * @param appId Id of the application
	 * @returns An [Application role connection](https://discord.com/developers/docs/resources/user#application-role-connection-object)
	 *
	 * | OAUTH2 Scopes          | Condition |
	 * |------------------------|-----------|
	 * | role_connections.write | always    |
	 *
	 * @example
	 * // Updates a role connection for an app
	 * const client = new SnowTransfer("TOKEN")
	 * const connection = await client.user.updateApplicationRoleConnection("app id", { platform_name: "some platform", platform_username: "Cool user 22" })
	 */
	public async updateApplicationRoleConnection(appId: string, data: RESTPutAPICurrentUserApplicationRoleConnectionJSONBody): Promise<RESTPutAPICurrentUserApplicationRoleConnectionResult> {
		return this.requestHandler.request(Endpoints.USER_APPLICATION_ROLE_CONNECTION("@me", appId), "put", "json", data);
	}
}

export = UserMethods;
