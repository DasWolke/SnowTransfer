import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import type {
	APIGuildMember,
	APIGuildWidget,
	RESTDeleteAPIGuildBanResult,
	RESTDeleteAPIGuildIntegrationResult,
	RESTDeleteAPIGuildMemberResult,
	RESTDeleteAPIGuildMemberRoleResult,
	RESTDeleteAPIGuildResult,
	RESTDeleteAPIGuildRoleResult,
	RESTGetAPIGuildBanResult,
	RESTGetAPIGuildBansQuery,
	RESTGetAPIGuildBansResult,
	RESTGetAPIGuildChannelsResult,
	RESTGetAPIGuildIntegrationsResult,
	RESTGetAPIGuildInvitesResult,
	RESTGetAPIGuildMemberResult,
	RESTGetAPIGuildMembersQuery,
	RESTGetAPIGuildMembersResult,
	RESTGetAPIGuildMembersSearchQuery,
	RESTGetAPIGuildMembersSearchResult,
	RESTGetAPIGuildPreviewResult,
	RESTGetAPIGuildPruneCountQuery,
	RESTGetAPIGuildPruneCountResult,
	RESTGetAPIGuildResult,
	RESTGetAPIGuildRolesResult,
	RESTGetAPIGuildThreadsResult,
	RESTGetAPIGuildVanityUrlResult,
	RESTGetAPIGuildVoiceRegionsResult,
	RESTGetAPIGuildWelcomeScreenResult,
	RESTGetAPIGuildWidgetSettingsResult,
	RESTPatchAPICurrentGuildMemberJSONBody,
	RESTPatchAPIGuildChannelPositionsJSONBody,
	RESTPatchAPIGuildChannelPositionsResult,
	RESTPatchAPIGuildJSONBody,
	RESTPatchAPIGuildMemberJSONBody,
	RESTPatchAPIGuildMemberResult,
	RESTPatchAPIGuildResult,
	RESTPatchAPIGuildRoleJSONBody,
	RESTPatchAPIGuildRolePositionsJSONBody,
	RESTPatchAPIGuildRolePositionsResult,
	RESTPatchAPIGuildRoleResult,
	RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
	RESTPatchAPIGuildVoiceStateCurrentMemberResult,
	RESTPatchAPIGuildVoiceStateUserJSONBody,
	RESTPatchAPIGuildVoiceStateUserResult,
	RESTPatchAPIGuildWelcomeScreenJSONBody,
	RESTPatchAPIGuildWelcomeScreenResult,
	RESTPatchAPIGuildWidgetSettingsJSONBody,
	RESTPatchAPIGuildWidgetSettingsResult,
	RESTPostAPIGuildChannelJSONBody,
	RESTPostAPIGuildChannelResult,
	RESTPostAPIGuildPruneJSONBody,
	RESTPostAPIGuildPruneResult,
	RESTPostAPIGuildRoleJSONBody,
	RESTPostAPIGuildRoleResult,
	RESTPostAPIGuildsJSONBody,
	RESTPostAPIGuildsResult,
	RESTPutAPIGuildBanJSONBody,
	RESTPutAPIGuildBanResult,
	RESTPutAPIGuildMemberJSONBody,
	RESTPutAPIGuildMemberResult,
	RESTPutAPIGuildMemberRoleResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
	public requestHandler: (typeof import("../RequestHandler"))["RequestHandler"]["prototype"];

	/**
	 * Create a new Guild Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guild.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: GuildMethods["requestHandler"]) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Create a new Guild, **limited to 10 guilds (you may create more if you are whitelisted)**
	 * Check the [discord docs](https://discord.com/developers/docs/resources/guild#create-guild) for more infos
	 * @param data Data for the new guild
	 * @returns [Guild](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * @example
	 * // Creates a simple guild with the name "Demo Guild"
	 * const client = new SnowTransfer("TOKEN")
	 * const guildData = {
	 * 	name: "Demo Guild"
	 * }
	 * const guild = await client.guild.createGuild(guildData)
	 */
	public async createGuild(data: RESTPostAPIGuildsJSONBody): Promise<RESTPostAPIGuildsResult> {
		return this.requestHandler.request(Endpoints.GUILDS, {}, "post", "json", data);
	}

	/**
	 * Get a guild via Id
	 *
	 * CurrentUser must be a member of the guild
	 * @param guildId Id of the guild
	 * @param withCounts when true, will return approximate member and presence counts for the guild
	 * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const guild = await client.guild.getGuild("guild id")
	 */
	public async getGuild(guildId: string, withCounts?: boolean): Promise<RESTGetAPIGuildResult> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), { with_counts: withCounts }, "get", "json");
	}

	/**
	 * Gets a guild's preview. If the CurrentUser is not in the guild, the guild must be lurkable
	 * @param guildId Id of the guild
	 * @returns [Guild preview](https://discord.com/developers/docs/resources/guild#guild-preview-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const guildPreview = await client.guild.getGuildPreview("guild id")
	 */
	public async getGuildPreview(guildId: string): Promise<RESTGetAPIGuildPreviewResult> {
		return this.requestHandler.request(Endpoints.GUILD_PREVIEW(guildId), {}, "get", "json");
	}

	/**
	 * Update a guild
	 * @param guildId Id of the guild
	 * @param data Updated guild data
	 * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // Update the name of a guild to "Nice Guild"
	 * const client = new SnowTransfer("TOKEN")
	 * const guildData = {
	 * 	name: "Nice Guild"
	 * }
	 * client.guild.updateGuild("guild Id", guildData)
	 */
	public async updateGuild(guildId: string, data: RESTPatchAPIGuildJSONBody): Promise<RESTPatchAPIGuildResult> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), {}, "patch", "json", data);
	}

	/**
	 * Delete a guild
	 *
	 * CurrentUser must be the owner of the guild
	 *
	 * **This action is irreversible, so use it with caution!**
	 * @param guildId Id of the guild
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.deleteGuild("guild id")
	 */
	public async deleteGuild(guildId: string): Promise<RESTDeleteAPIGuildResult> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), {}, "delete", "json") as RESTDeleteAPIGuildResult;
	}

	/**
	 * Get a list of all channels for a guild. Does not include threads
	 *
	 * CurrentUser must be a member of the guild
	 * @param guildId Id of the guild
	 * @returns list of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const channels = await client.guild.getGuildChannels("guild id")
	 */
	public async getGuildChannels(guildId: string): Promise<RESTGetAPIGuildChannelsResult> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), {}, "get", "json");
	}

	/**
	 * Create a channel within a guild
	 * @param guildId Id of the guild
	 * @param data channel properties
	 * @returns [channel object](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition                                                       |
	 * |--------------------|-----------------------------------------------------------------|
	 * | MANAGE_CHANNELS    | always                                                          |
	 * | ADMINISTRATOR      | setting MANAGE_ROLES in permission_overwrites                   |
	 * | *                  | if setting * permission in overwrites where * is any permission |
	 *
	 * @example
	 * // Creates a guild voice channel with the name "nice voice channel" and with permission connect denied for the @everyone role
	 * const client = new SnowTransfer("TOKEN")
	 * const channelData = \{
	 * 	name: "nice voice channel",
	 * 	type: 2,
	 * 	permission_overwrites: [\{ id: "guild id", type: 0, allow: "0" deny: (BigInt(1) << BigInt(20)).toString() \}]
	 * \}
	 * const channel = await client.guild.createGuildChannel("guild id", channelData)
	 */
	public async createGuildChannel(guildId: string, data: RESTPostAPIGuildChannelJSONBody): Promise<RESTPostAPIGuildChannelResult> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), {}, "post", "json", data);
	}

	/**
	 * Batch update the positions of channels. Only those being moved needs to be included here
	 * @param guildId Id of the guild
	 * @param data Positional data to send
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 *
	 * @example
	 * // Sets the position of a channel to 2 under a category channel
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.updateChannelPositions("guild id", [{ id: "channel id", position: 2, category_id: "category id" }], "they looked out of order")
	 */
	public async updateChannelPositions(guildId: string, data: RESTPatchAPIGuildChannelPositionsJSONBody, reason?: string): Promise<RESTPatchAPIGuildChannelPositionsResult> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), {}, "patch", "json", data, reason ? { "X-Audit-Log-Reason": reason } : undefined) as RESTPatchAPIGuildChannelPositionsResult;
	}

	/**
	 * Returns all active threads in the guild, including public and private threads. Threads are ordered by their `id`, in descending order
	 * @param guildId Id of the guild
	 * @returns All active threads and member objects of the CurrentUser that the CurrentUser has access to.
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const threads = await client.guild.listActiveThreads("guild id")
	 */
	public async listActiveThreads(guildId: string): Promise<RESTGetAPIGuildThreadsResult> {
		return this.requestHandler.request(Endpoints.GUILD_THREADS_ACTIVE(guildId), {}, "get", "json");
	}

	/**
	 * Get a guild member via Id
	 *
	 * CurrentUser must be a member of the guild
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const member = await client.guild.getGuildMember("guild id", "member id")
	 */
	public async getGuildMember(guildId: string, memberId: string): Promise<RESTGetAPIGuildMemberResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), {}, "get", "json");
	}

	/**
	 * Get a list of guild members
	 *
	 * CurrentUser must be a member of the guild
	 * @param guildId Id of the guild
	 * @param data query data
	 * @returns list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 *
	 * | Intents       |
	 * |---------------|
	 * | GUILD_MEMBERS |
	 *
	 * @example
	 * // Gets 10 members from a guild
	 * const client = new SnowTransfer("TOKEN")
	 * const members = await client.guild.getGuildMembers("guild id", { limit: 10 })
	 */
	public async getGuildMembers(guildId: string, data?: RESTGetAPIGuildMembersQuery): Promise<RESTGetAPIGuildMembersResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), data, "get", "json");
	}

	/**
	 * Get a list of guild members that match a query
	 * @param guildId Id of the guild
	 * @param options query data
	 * @returns list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 *
	 * @example
	 * // Gets all members with the username "Wolke"
	 * const client = new SnowTransfer("TOKEN")
	 * const members = await client.guild.searchGuildMembers("guild id", { query: "Wolke" })
	 */
	public async searchGuildMembers(guildId: string, options: RESTGetAPIGuildMembersSearchQuery): Promise<RESTGetAPIGuildMembersSearchResult> {
		if (options.limit !== undefined && (options.limit < Constants.SEARCH_MEMBERS_MIN_RESULTS || options.limit > Constants.SEARCH_MEMBERS_MAX_RESULTS)) throw new RangeError(`Limit for searching guild members has to be between ${Constants.SEARCH_MEMBERS_MIN_RESULTS} and ${Constants.SEARCH_MEMBERS_MAX_RESULTS}`);
		return this.requestHandler.request(Endpoints.GUILD_MEMBERS_SEARCH(guildId), options, "get", "json");
	}

	/**
	 * Add a guild member to a guild via oauth2 access token
	 *
	 * CurrentUser must be a member of the guild
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object containing the needed request data
	 * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure) or void if the member is already in the guild
	 *
	 * | Permissions needed    | Condition |
	 * |-----------------------|-----------|
	 * | CREATE_INSTANT_INVITE | always    |
	 *
	 * | OAUTH2 Scopes |
	 * |---------------|
	 * | guilds.join   |
	 *
	 * @example
	 * // add a user to a server
	 * const client = new SnowTransfer("TOKEN")
	 * const memberData = {
	 * 	access_token: "access token of a user with the guilds.join scope"
	 * }
	 * client.guild.addGuildMember("guildId", "memberId", memberData)
	 */
	public async addGuildMember(guildId: string, memberId: string, data: RESTPutAPIGuildMemberJSONBody): Promise<RESTPutAPIGuildMemberResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), {}, "put", "json", data);
	}

	/**
	 * Update properties of a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data Updated properties
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition    |
	 * |--------------------|--------------|
	 * | MANAGE_NICKNAMES   | Nick Updates |
	 * | MANAGE_ROLES       | Role Updates |
	 * | MUTE_MEMBERS       | Mute Updates |
	 * | DEAFEN_MEMBERS     | Deaf Updates |
	 * | MOVE_MEMBERS       | Voice Move   |
	 * | CONNECT						| Voice Move   |
	 * | MODERATE_MEMBERS   | Timeouts     |
	 *
	 * @example
	 * // Reset the nickname of a guild member
	 * const client = new SnowTransfer("TOKEN")
	 * const memberData = {
	 * 	nick: "" // You can reset nicknames by providing an empty string as the value of data.nick
	 * }
	 * const member = await client.guild.updateGuildMember("guild Id", "memberId", memberData)
	 */
	public async updateGuildMember(guildId: string, memberId: string, data: RESTPatchAPIGuildMemberJSONBody): Promise<RESTPatchAPIGuildMemberResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), {}, "patch", "json", data);
	}

	/**
	 * Update the nick of the CurrentMember
	 * @param guildId Id of the guild
	 * @param data object with a nick property and optionally, a reason property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | CHANGE_NICKNAME    | always    |
	 *
	 * @example
	 * // change nick of bot to "Nice Nick"
	 * const client = new SnowTransfer("TOKEN")
	 * const nickData = {
	 * 	nick: "Nice Nick"
	 * }
	 * client.guild.updateSelf("guildId", nickData)
	 */
	public async updateSelf(guildId: string, data: RESTPatchAPICurrentGuildMemberJSONBody & { reason?: string; }): Promise<APIGuildMember> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, "@me"), {}, "patch", "json", data);
	}

	/**
	 * Add a role to a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param roleId Id of the role
	 * @param reason The reason for the role to be added
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * // add a role to a member with a reason of "I want to add a role"
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.addGuildMemberRole("guildId", "memberId", "roleId", "I want to add a role")
	 */
	public async addGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string): Promise<RESTPutAPIGuildMemberRoleResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), {}, "put", "json", { reason }) as RESTPutAPIGuildMemberRoleResult;
	}

	/**
	 * Remove a role from a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param roleId Id of the role
	 * @param data object with reason property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * // remove a role from a member with a reason of "I want to remove a role"
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.removeGuildMemberRole("guildId", "memberId", "roleId", "I want to remove a role")
	 */
	public async removeGuildMemberRole(guildId: string, memberId: string, roleId: string, reason?: string): Promise<RESTDeleteAPIGuildMemberRoleResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildMemberRoleResult;
	}

	/**
	 * Remove a guild member (aka kick them)
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param reason Reason for kicking the member
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 *
	 * @example
	 * // Kick a member with a reason of "spam"
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.removeGuildMember("guild Id", "memberId", "spam")
	 */
	public async removeGuildMember(guildId: string, memberId: string, reason?: string): Promise<RESTDeleteAPIGuildMemberResult> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildMemberResult;
	}

	/**
	 * Get bans of a guild
	 * @param guildId Id of the guild
	 * @param query Query string options
	 * @returns List of [bans](https://discord.com/developers/docs/resources/guild#ban-object-ban-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const bans = await client.guild.getGuildBans("guildId")
	 */
	public async getGuildBans(guildId: string, options?: RESTGetAPIGuildBansQuery): Promise<RESTGetAPIGuildBansResult> {
		return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), options, "get", "json");
	}

	/**
	 * Get a specific ban of a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the member
	 * @returns [ban](https://discord.com/developers/docs/resources/guild#ban-object-ban-structure) object
	 *
	 * @throws a `DiscordAPIError` if the member is not banned
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const ban = await client.guild.getGuildBan("guildId", "memberId")
	 */
	public async getGuildBan(guildId: string, memberId: string): Promise<RESTGetAPIGuildBanResult> {
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), {}, "get", "json");
	}

	/**
	 * Ban a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object with a reason and a delete_message_days property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 *
	 * @example
	 * // Ban a user with a reason and delete the last 2 days of their messages
	 * const client = new SnowTransfer("TOKEN")
	 * const banData = {
	 * 	reason: "Memes were not good enough",
	 * 	delete_message_days":2
	 * }
	 * client.guild.createGuildBan("guild Id", "memberId", banData)
	 */
	public async createGuildBan(guildId: string, memberId: string, data?: RESTPutAPIGuildBanJSONBody & { reason?: string; }): Promise<RESTPutAPIGuildBanResult> {
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), {}, "put", "json", data) as RESTPutAPIGuildBanResult;
	}

	/**
	 * Remove a ban of a user
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param reason Reason for removing the ban
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 *
	 * @example
	 * // Remove a ban of a user with a reason
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.removeGuildBan("guildId", "memberId", "This guy was cool")
	 */
	public async removeGuildBan(guildId: string, memberId: string, reason?: string): Promise<RESTDeleteAPIGuildBanResult> {
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildBanResult;
	}

	/**
	 * Get a list of roles for a guild
	 * @param guildId Id of the guild
	 * @returns array of [roles](https://discord.com/developers/docs/topics/permissions#role-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const roles = await client.guild.getGuildRoles("guildId")
	 */
	public async getGuildRoles(guildId: string): Promise<RESTGetAPIGuildRolesResult> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), {}, "get", "json");
	}

	/**
	 * Create a new Role
	 * @param guildId Id of the guild
	 * @param data data with role properties
	 * @returns [role](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * // Create a role with the name "Nice Role" and a color of a soft blue
	 * const client = new SnowTransfer("TOKEN")
	 * const roleData = {
	 * 	name: "Nice Role",
	 * 	color: 0x7c7cf8
	 * }
	 * client.guild.createGuildRole("guild Id", roleData)
	 */
	public async createGuildRole(guildId: string, data?: RESTPostAPIGuildRoleJSONBody & { reason?: string; }): Promise<RESTPostAPIGuildRoleResult> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), {}, "post", "json", data);
	}

	/**
	 * Modify the positions of roles
	 * @param guildId Id of the guild
	 * @param data Role data to update
	 * @returns array of [roles](https://discord.com/developers/docs/topics/permissions#role-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const roles = await client.guild.updateGuildRolePositions("guildId", [{ id: "guild id", position: 1 }, { id: "role id 2", position: 2 }])
	 */
	public async updateGuildRolePositions(guildId: string, data: RESTPatchAPIGuildRolePositionsJSONBody, reason?: string): Promise<RESTPatchAPIGuildRolePositionsResult> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), {}, "patch", "json", data, reason ? { "X-Audit-Log-Reason": reason } : undefined);
	}

	/**
	 * Update a guild role
	 * @param guildId Id of the guild
	 * @param roleId Id of the role
	 * @param data updated properties of the role
	 * @returns [Updated Role](https://discord.com/developers/docs/topics/permissions#role-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const roleData = {
	 * 	name: "Nicer Role",
	 * }
	 * client.guild.updateGuildRole("guildId", "roleId", roleData)
	 */
	public async updateGuildRole(guildId: string, roleId: string, data: RESTPatchAPIGuildRoleJSONBody): Promise<RESTPatchAPIGuildRoleResult> {
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), {}, "patch", "json", data);
	}

	/**
	 * Delete a role from the guild
	 * @param guildId Id of the guild
	 * @param roleId Id of the role
	 * @param reason Reason for deleting the role
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 *
	 * @example
	 * // Deletes a role with a reason "This role is too cool"
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.deleteGuildRole("guildId", "roleId", "This role is too cool")
	 */
	public async removeGuildRole(guildId: string, roleId: string, reason?: string): Promise<RESTDeleteAPIGuildRoleResult> {
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildRoleResult;
	}

	/**
	 * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
	 * @param guildId Id of the guild
	 * @param data Object with prune data
	 * @returns Object with a "pruned" key indicating the amount of members that would be pruned
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const data = await client.guild.getGuildPruneCount("guildId", { days: 7 })
	 */
	public async getGuildPruneCount(guildId: string, query?: RESTGetAPIGuildPruneCountQuery): Promise<RESTGetAPIGuildPruneCountResult> {
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), query, "get", "json");
	}

	/**
	 * Start a prune
	 * @param guildId Id of the guild
	 * @param data Object with prune data
	 * @returns Object with a "pruned" key indicating the amount of members that were pruned
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const data = await client.guild.startGuildPrune("guildId", { days: 7 })
	 */
	public async startGuildPrune(guildId: string, data: RESTPostAPIGuildPruneJSONBody & { computer_prune_count: true; reason?: string; }): Promise<RESTPostAPIGuildPruneResult & { pruned: number; }>
	public async startGuildPrune(guildId: string, data: RESTPostAPIGuildPruneJSONBody & { computer_prune_count: false; reason?: string; }): Promise<RESTPostAPIGuildPruneResult & { pruned: null; }>
	public async startGuildPrune(guildId: string, data: RESTPostAPIGuildPruneJSONBody & { reason?: string; }): Promise<RESTPostAPIGuildPruneResult> {
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), {}, "post", "json", data);
	}

	/**
	 * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
	 * @param guildId Id of the guild
	 * @returns List of [voice regions](https://discord.com/developers/docs/resources/voice#voice-region-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const regions = await client.guild.getGuildVoiceRegions("guildId")
	 */
	public async getGuildVoiceRegions(guildId: string): Promise<RESTGetAPIGuildVoiceRegionsResult> {
		return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), {}, "get", "json");
	}

	/**
	 * Get invites for a guild
	 * @param guildId Id of the guild
	 * @returns List of [invites](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const invites = await client.guild.getGuildInvites("guildId")
	 */
	public async getGuildInvites(guildId: string): Promise<RESTGetAPIGuildInvitesResult> {
		return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), {}, "get", "json");
	}

	/**
	 * Get integrations for a guild
	 * @param guildId Id of the guild
	 * @returns List of [integration objects](https://discord.com/developers/docs/resources/guild#integration-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const integrations = await client.guild.getGuildIntegrations("guildId")
	 */
	public async getGuildIntegrations(guildId: string): Promise<RESTGetAPIGuildIntegrationsResult> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), {}, "get", "json");
	}

	/**
	 * Delete a guild integration
	 * @param guildId Id of the guild
	 * @param integrationId Id of the integration
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * await client.guild.deleteGuildIntegration("guildId", "integrationId", "Didn't need anymore")
	 */
	public async removeGuildIntegration(guildId: string, integrationId: string, reason?: string): Promise<RESTDeleteAPIGuildIntegrationResult> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), {}, "delete", "json", { reason }) as RESTDeleteAPIGuildIntegrationResult;
	}

	/**
	 * Get a guild widget settings object
	 * @param guildId Id of the guild
	 * @returns [Guild Widget settings](https://discord.com/developers/docs/resources/guild#guild-widget-settings-object-guild-widget-settings-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const widgetSettings = await client.guild.getGuildWidgetSettings("guildId")
	 */
	public async getGuildWidgetSettings(guildId: string): Promise<RESTGetAPIGuildWidgetSettingsResult> {
		return this.requestHandler.request(Endpoints.GUILD_WIDGET_SETTINGS(guildId), {}, "get", "json");
	}

	/**
	 * Update a guild widget settings object
	 * @param guildId Id of the guild
	 * @param data widget settings
	 * @returns Updated [Guild Widget settings](https://discord.com/developers/docs/resources/guild#guild-widget-settings-object-guild-widget-settings-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // Sets a widget as disabled
	 * const client = new SnowTransfer("TOKEN")
	 * const widgetSettings = await client.guild.updateGuildWidgetSettings("guildId", { enabled: false })
	 */
	public async updateGuildWidgetSettings(guildId: string, data: Partial<RESTPatchAPIGuildWidgetSettingsJSONBody & { reason?: string }>): Promise<RESTPatchAPIGuildWidgetSettingsResult> {
		return this.requestHandler.request(Endpoints.GUILD_WIDGET_SETTINGS(guildId), {}, "patch", "json", data);
	}

	/**
	 * Gets a guild widget object
	 * @param guildId Id of the guild
	 * @returns [Guild Widget](https://discord.com/developers/docs/resources/guild#guild-widget-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const widget = await client.guild.getGuildWidget("guildId")
	 */
	public async getGuildWidget(guildId: string): Promise<APIGuildWidget> { // no return type in api types
		return this.requestHandler.request(Endpoints.GUILD_WIDGET(guildId), {}, "get", "json");
	}

	/**
	 * Get a guild's vanity URL code
	 * @param guildId Id of the guild
	 * @returns partial [invite object](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url-example-partial-invite-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const vanityUrl = await client.guild.getGuildVanityUrl("guildId")
	 */
	public async getGuildVanityURL(guildId: string): Promise<RESTGetAPIGuildVanityUrlResult> {
		return this.requestHandler.request(Endpoints.GUILD_VANITY(guildId), {}, "get", "json");
	}

	/**
	 * Get a guild's welcome screen object
	 * @param guildId Id of the guild
	 * @returns [Guild Welcome Screen](https://discord.com/developers/docs/resources/guild#welcome-screen-object)
	 *
	 * | Permissions needed | Condition                            |
	 * |--------------------|--------------------------------------|
	 * | MANAGE_GUILD       | if the welcome screen is not enabled |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const welcomeScreen = await client.guild.getGuildWelcomeScreen("guildId")
	 */
	public async getGuildWelcomeScreen(guildId: string): Promise<RESTGetAPIGuildWelcomeScreenResult> {
		return this.requestHandler.request(Endpoints.GUILD_WELCOME_SCREEN(guildId), {}, "get", "json");
	}

	/**
	 * Update a guild welcome screen object
	 * @param guildId Id of guild
	 * @param data Welcome screen data
	 * @returns [Guild Welcome Screen](https://discord.com/developers/docs/resources/guild#welcome-screen-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // Disabled the welcome screen
	 * const client = new SnowTransfer("TOKEN")
	 * const welcomeScreen = await client.guild.updateGuildWelcomeScreen("guildId", { enabled: false })
	 */
	public async editGuildWelcomeScreen(guildId: string, data: RESTPatchAPIGuildWelcomeScreenJSONBody & { reason?: string; }): Promise<RESTPatchAPIGuildWelcomeScreenResult> {
		return this.requestHandler.request(Endpoints.GUILD_WELCOME_SCREEN(guildId), {}, "patch", "json", data);
	}

	/**
	 * Updates the current user's voice state in a stage channel
	 * @param guildId Id of the guild
	 * @param data Data of the voice state
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                           |
	 * |--------------------|-------------------------------------|
	 * | MUTE_MEMBERS       | when trying to un-suppress yourself |
	 * | REQUEST_TO_SPEAK   | when trying to request to speak     |
	 *
	 * @example
	 * // Unsuppresses the CurrentUser in the stage channel they're in
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.updateGuildVoiceState("guildId", { channel_id: "channel id", suppress: false })
	 */
	public updateCurrentUserVoiceState(guildId: string, data: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody): Promise<RESTPatchAPIGuildVoiceStateCurrentMemberResult> {
		return this.requestHandler.request(Endpoints.GUILD_VOICE_STATE_USER(guildId, "@me"), {}, "patch", "json", data) as RESTPatchAPIGuildVoiceStateCurrentMemberResult;
	}

	/**
	 * Updates a user's voice state in a stage channel
	 * @param guildId Id of the guild
	 * @param data Data of the voice state
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition                           |
	 * |--------------------|-------------------------------------|
	 * | MUTE_MEMBERS       | when trying to suppress/un-suppress |
	 *
	 * @example
	 * // Suppresses the user in the stage channel they're in
	 * const client = new SnowTransfer("TOKEN")
	 * client.guild.updateGuildVoiceState("guildId", "userId", { channel_id: "channel id", suppress: true })
	 */
	public updateUserVoiceState(guildId: string, userId: string, data: RESTPatchAPIGuildVoiceStateUserJSONBody): Promise<RESTPatchAPIGuildVoiceStateUserResult> {
		return this.requestHandler.request(Endpoints.GUILD_VOICE_STATE_USER(guildId, userId), {}, "patch", "json", data) as RESTPatchAPIGuildVoiceStateUserResult;
	}
}

export = GuildMethods;

// Please end my suffering (ft. Papi)

// those moves https://youtu.be/oCrwzN6eb4Q?t=51s
// Papi: nice
