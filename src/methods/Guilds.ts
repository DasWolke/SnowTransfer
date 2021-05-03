import Endpoints from "../Endpoints";

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Guild Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guild.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler - request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Create a new Guild, **limited to 10 guilds (you may create more if you are whitelisted)**
	 * Check the [discord docs](https://discord.com/developers/docs/resources/guild#create-guild) for more infos
	 * @param {object} data data
	 * @returns [Guild](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * @example
	 * // Creates a simple guild with the name "Demo Guild"
	 * let client = new SnowTransfer('TOKEN')
	 * let guildData = {
	 *   name: 'Demo Guild'
	 * }
	 * client.guild.createGuild(guildData)
	 */
	public async createGuild(data: CreateGuildData): Promise<import("@amanda/discordtypings").GuildData> {
		return this.requestHandler.request(Endpoints.GUILDS, "post", "json", data);
	}

	/**
	 * Get a guild via Id
	 *
	 * **Your bot has to be a member of the guild for this function to work**
	 * @param guildId Id of the guild
	 * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 */
	public async getGuild(guildId: string): Promise<import("@amanda/discordtypings").GuildData> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), "get", "json");
	}

	/**
	 * Update a guild
	 * @param guildId Id of the guild
	 * @param data data
	 * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // Update the name of a guild to "Nice Guild"
	 * let client = new SnowTransfer('TOKEN')
	 * let guildData = {
	 *   name: 'Nice Guild'
	 * }
	 * client.guild.updateGuild('guild Id', guildData)
	 */
	public async updateGuild(guildId: string, data: UpdateGuildData): Promise<import("@amanda/discordtypings").GuildData> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), "patch", "json", data);
	}

	/**
	 * Delete a guild
	 *
	 * **Your bot has to be the owner of the guild to do this**
	 *
	 * **This action is irreversible, so use it with caution!**
	 * @param guildId Id of the guild
	 * @returns Resolves the Promise on successful execution
	 */
	public async deleteGuild(guildId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD(guildId), "delete", "json");
	}

	/**
	 * Get a list of channels for a guild
	 * @param guildId Id of the guild
	 * @returns list of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 */
	public async getGuildChannels(guildId: string): Promise<Array<import("@amanda/discordtypings").GuildChannelData>> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "get", "json");
	}

	/**
	 * Create a channel within a guild
	 * @param guildId Id of the guild
	 * @param data channel properties
	 * @returns [channel object](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 */
	public async createGuildChannel(guildId: string, data: CreateGuildChannelData): Promise<import("@amanda/discordtypings").GuildChannelData> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "post", "json", data);
	}

	/**
	 * Batch update the positions of channels
	 * @param guildId Id of the guild
	 * @returns Resolves the Promise on successful execution
	 */
	public async updateChannelPositions(guildId: string, data: Array<{ id: string; position: number; }>): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "patch", "json", data);
	}

	/**
	 * Get a guild member via Id
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 */
	public async getGuildMember(guildId: string, memberId: string): Promise<import("@amanda/discordtypings").MemberData> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "get", "json");
	}

	/**
	 * Get a list of guild members
	 * @param guildId Id of the guild
	 * @param data query data
	 * @returns list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 */
	public async getGuildMembers(guildId: string, data: GetGuildMembersData = {}): Promise<Array<import("@amanda/discordtypings").MemberData>> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), "get", "json", data);
	}

	/**
	 * Add a guild member to a guild via oauth2 access token
	 *
	 * **You need the oauth2 `guilds.join` scope granted to the access_token**
	 *
	 *
	 * **Your bot has to be a member of the guild you want to add the user to**
	 *
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object containing the needed request data
	 * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
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
	 * let client = new SnowTransfer('TOKEN')
	 * let memberData = {
	 *   access_token: 'access token of a user with the guilds.join scope'
	 * }
	 * client.guild.addGuildMember('guildId', 'memberId', memberData)
	 */
	public async addGuildMember(guildId: string, memberId: string, data: AddGuildMemberData): Promise<import("@amanda/discordtypings").MemberData> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "put", "json", data);
	}

	/**
	 * Update properties of a guild member
	 *
	 * **Check the table below to make sure you have the right permissions for the types of updates**
	 *
	 * **Make sure that your bot has `CONNECT` and `MOVE_MEMBERS` on the channel you want to move the member to**
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
	 *
	 * @example
	 * // Reset the nickname of a guild member
	 * let client = new SnowTransfer('TOKEN')
	 * let memberData = {
	 *   nick: "" // You can reset nicknames by providing an empty string as the value of data.nick
	 * }
	 * client.guild.updateGuildMember('guild Id', 'memberId', memberData)
	 */
	public async updateGuildMember(guildId: string, memberId: string, data: UpdateGuildMemberData): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "patch", "json", data);
	}

	/**
	 * Update the nick of the current user
	 * @param guildId Id of the guild
	 * @param data object with a nick property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | CHANGE_NICKNAME    | always    |
	 *
	 * @example
	 * // change nick of bot to "Nice Nick"
	 * let client = new SnowTransfer('TOKEN')
	 * let nickData = {
	 *   nick: 'Nice Nick'
	 * }
	 * client.guild.updateSelf('guildId', nickData)
	 */
	public async updateSelf(guildId: string, data: { nick: string; }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_NICK(guildId, "@me"), "patch", "json", data);
	}

	/**
	 * Add a role to a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param roleId Id of the role
	 * @param data object with reason property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 */
	public async addGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: { reason?: string }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "put", "json", data);
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
	 */
	public async removeGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: { reason?: string }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "delete", "json", data);
	}

	/**
	 * Remove a guild member (aka kick them)
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object with reason property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 *
	 * @example
	 * // Kick a member with a reason of "spam"
	 * let client = new SnowTransfer('TOKEN')
	 * let kickData = {
	 *   reason: 'spam'
	 * }
	 * client.guild.removeGuildMember('guild Id', 'memberId', kickData)
	 */
	public async removeGuildMember(guildId: string, memberId: string, data?: { reason?: string }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "delete", "json", data);
	}

	/**
	 * Get bans of a guild
	 * @param guildId Id of the guild
	 * @returns List of [bans](https://discord.com/developers/docs/resources/guild#ban-object-ban-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 */
	public async getGuildBans(guildId: string): Promise<Array<any>> {
		return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), "get", "json");
	}

	/**
	 * Ban a guild member
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object with a reason and a delete-message-days property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 *
	 * @example
	 * // Ban a user with a reason and delete the last 2 days of their messages
	 * let client = new SnowTransfer('TOKEN')
	 * let banData = {
	 *   reason: 'Memes were not good enough',
	 *   "delete_message_days":2
	 * }
	 * client.guild.createGuildBan('guild Id', 'memberId', banData)
	 */
	public async createGuildBan(guildId: string, memberId: string, data?: { reason?: string; delete_message_days?: number; }): Promise<void> {
		let newData;
		if (data) {
			if (data.reason) Object.assign(newData, { queryReason: data.reason });
			if (data.delete_message_days) Object.assign(newData, { "delete_message_days": data.delete_message_days });
		}
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), "put", "json", newData);
	}

	/**
	 * Remove a ban of a user
	 * @param guildId Id of the guild
	 * @param memberId Id of the guild member
	 * @param data object with a reason property
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | BAN_MEMBERS        | always    |
	 */
	public async removeGuildBan(guildId: string, memberId: string, data?: { reason?: string; }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), "delete", "json", data);
	}

	/**
	 * Get a list of roles for a guild
	 * @param guildId Id of the guild
	 * @returns array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 */
	public async getGuildRoles(guildId: string): Promise<Array<import("@amanda/discordtypings").RoleData>> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "get", "json");
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
	 * let client = new SnowTransfer('TOKEN')
	 * let roleData = {
	 *   name: 'Nice Role',
	 *   color: 0x7c7cf8
	 * }
	 * client.guild.createGuildRole('guild Id', roleData)
	 */
	public async createGuildRole(guildId: string, data?: RoleOptions): Promise<import("@amanda/discordtypings").RoleData> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "post", "json", data);
	}

	/**
	 * Batch modify the positions of roles
	 * @param guildId Id of the guild
	 * @param data Array of objects with id and position properties
	 * @returns array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 */
	public async updateGuildRolePositions(guildId: string, data: Array<{ id: string; position: number; }>): Promise<Array<import("@amanda/discordtypings").RoleData>> {
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "put", "json", data);
	}

	/**
	 * Update a guild role
	 * @param guildId Id of the guild
	 * @param roleId Id of the role
	 * @param data updated properties of the role
	 * @returns [Updated Role](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 */
	public async updateGuildRole(guildId: string, roleId: string, data: RoleOptions): Promise<import("@amanda/discordtypings").RoleData> {
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), "patch", "json", data);
	}

	/**
	 * Delete a role from the guild
	 * @param guildId Id of the guild
	 * @param roleId Id of the role
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_ROLES       | always    |
	 */
	public async removeGuildRole(guildId: string, roleId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), "delete", "json");
	}

	/**
	 * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
	 * @param guildId Id of the guild
	 * @param data Object with a days property
	 * @returns Object with a "pruned" key indicating the amount of members that would be pruned
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 */
	public async getGuildPruneCount(guildId: string, data: { days: number }): Promise<{ pruned: number }> {
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), "get", "json", data);
	}

	/**
	 * Start a prune
	 * @param guildId Id of the guild
	 * @param data Object with a days property
	 * @returns Object with a "pruned" key indicating the amount of members that were pruned
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | KICK_MEMBERS       | always    |
	 */
	public async startGuildPrune(guildId: string, data: { days: number }): Promise<{ pruned: number; }> {
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), "post", "json", data);
	}

	/**
	 * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
	 * @param guildId Id of the guild
	 * @returns List of [voice regions](https://discord.com/developers/docs/resources/voice#voice-region-object)
	 */
	public async getGuildVoiceRegions(guildId: string): Promise<Array<any>> {
		return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), "get", "json");
	}

	/**
	 * Get invites for a guild
	 * @param guildId Id of the guild
	 * @returns List of [invites](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async getGuildInvites(guildId: string): Promise<Array<any>> {
		return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), "get", "json");
	}

	/**
	 * Get integrations for a guild
	 * @param guildId Id of the guild
	 * @returns List of [integration objects](https://discord.com/developers/docs/resources/guild#integration-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async getGuildIntegrations(guildId: string): Promise<Array<any>> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), "get", "json");
	}

	/**
	 * Attach a integration object from the user to the guild
	 * @param guildId Id of the guild
	 * @param data Integration object with id and type properties
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async createGuildIntegration(guildId: string, data: { type: string; id: string; }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), "post", "json", data);
	}

	/**
	 * Update behaviour and settings of an [integration object](https://discord.com/developers/docs/resources/guild#integration-object)
	 * @param guildId Id of the guild
	 * @param integrationId Id of the integration
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async updateGuildIntegration(guildId: string, integrationId: string, data: { expire_behavior: number; expire_grace_period: number; enable_emoticons: boolean; }): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "patch", "json", data);
	}

	/**
	 * Delete a guild integratiom
	 * @param guildId Id of the guild
	 * @param integrationId Id of the integration
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async removeGuildIntegration(guildId: string, integrationId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
	}

	/**
	 * Synchronize a guild integration
	 * @param guildId Id of the guild
	 * @param integrationId Id of the integration
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async syncGuildIntegration(guildId: string, integrationId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
	}

	/**
	 * Get the guild embed object
	 * @param guildId Id of the guild
	 * @returns [Guild Embed](https://discord.com/developers/docs/resources/guild#guild-embed-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async getGuildEmbed(guildId: string): Promise<any> {
		return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), "get", "json");
	}

	/**
	 * Update a guild embed object
	 * @param guildId Id of the guild
	 * @returns [Guild Embed](https://discord.com/developers/docs/resources/guild#guild-embed-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public async updateGuildEmbed(guildId: string, data: { enabled: boolean; channel_id: string; }): Promise<any> {
		return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), "patch", "json", data);
	}
}

// Please end my suffering (ft. Papi)

interface CreateGuildData {
	/**
	 * name of the guild
	 */
	name: string;
	/**
	 * [voice region](https://discord.com/developers/docs/resources/voice#voice-region-voice-region-structure)
	 */
	region?: string;
	/**
	 * base64 encoded jpeg icon to use for the guild
	 */
	icon?: string;
	/**
	 * guild [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)
	 */
	verification_level?: number;
	/**
	 * default message [notification setting](https://discord.com/developers/docs/resources/guild#default-message-notification-level)
	 */
	default_message_notifications?: number;
	/**
	 * array of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 */
	channels?: Array<import("@amanda/discordtypings").ChannelData>;
	/**
	 * array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 */
	roles?: Array<import("@amanda/discordtypings").RoleData>;
}

interface UpdateGuildData {
	/**
	 * name of the guild
	 */
	name?: string;
	/**
	 * guild [voice region](https://discord.com/developers/docs/resources/voice#voice-region-voice-region-structure) Id
	 */
	region?: string;
	/**
	 * guild [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)
	 */
	verification_level?: number;
	/**
	 * message [notification setting](https://discord.com/developers/docs/resources/guild#default-message-notification-level)
	 */
	default_message_notifications?: number;
	/**
	 * Id of the afk channel
	 */
	afk_channel_id?: string;
	/**
	 * afk timeout in seconds
	 */
	afk_timeout?: number;
	/**
	 * base64 jpeg image of the guild icon
	 */
	icon?: string;
	/**
	 * Id of the owner user
	 */
	owner_id?: string;
	/**
	 * base64 jpeg image for the guild splash (vip/partner only)
	 */
	splash?: string;
}

interface CreateGuildChannelData {
	/**
	 * name of the channel
	 */
	name: string;
	/**
	 * [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of the channel
	 */
	type?: number;
	/**
	 * bitrate of the channel (voice only)
	 */
	bitrate?: number;
	/**
	 * user limit of a channel (voice only)
	 */
	user_limit?: number;
	/**
	 * permissions overwrites for the channel
	 */
	permission_overwrites?: Array<any>;
}

interface AddGuildMemberData {
	/**
	 * oauth2 access token with a `guilds.join` scope enabled
	 */
	access_token: string;
	/**
	 * nickname of the new member
	 */
	nick?: string;
	/**
	 * Array of Role Ids the new member should have
	 */
	roles?: Array<string>;
	/**
	 * if the new member should be muted
	 */
	mute?: boolean;
	/**
	 * if the new member is deaf
	 */
	deaf?: boolean;
}

interface UpdateGuildMemberData {
	nick?: string;
	roles?: Array<string>;
	mute?: boolean;
	deaf?: boolean;
	channel_id?: string | null;
}

interface GetGuildMembersData {
	limit?: number;
	after?: string;
}

interface RoleOptions {
	name?: string;
	permissions?: number;
	color?: number;
	hoist?: boolean;
	mentionable?: boolean;
}

/**
 * @typedef {object} Guild
 * @property {string} id - guild Id
 * @property {string} name - guild name
 * @property {string} icon - icon hash
 * @property {string} splash - splash image hash
 * @property {string} owner_id - Id of the owner
 * @property {string} region - Id of the voice region
 * @property {string} afk_channel_id - Id of the afk channel
 * @property {number} afk_timeout - afk timeout in seconds
 * @property {Boolean} embed_enabled - if the guild is embeddable
 * @property {string} embed_channel_id - Id of embedded channel
 * @property {number} verification level - [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) of the guild
 * @property {number} default_message_notifications - default
 * [notification level](https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of the guild
 * @property {number} explicit_content_filter - default [filter level](https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level)
 * @property {Role[]} roles - Array of roles
 * @property {import("./Emojis").Emoji[]} emojis - Array of emojis
 * @property {String[]} features - Array of enabled guild features
 * @property {number} mfa_level - required [mfa level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for the guild
 * @property {string} [application_id] - application Id of the guild creator, if the guild was created by a bot
 * @property {Boolean} widget_enabled - if the server widget is enabled
 * @property {string} widget_channel_id - channel Id of the server widget
 */

/**
 * @typedef {object} Role
 * @property {string} id - role Id
 * @property {string} name - role name
 * @property {number} color - integer representation of hexadecimal color code
 * @property {Boolean} hoist - if this role is hoisted
 * @property {number} position - position of the role
 * @property {number} permissions - permission bit set
 * @property {Boolean} managed - if this role is managed by an integration
 * @property {Boolean} mentionable - if this role can be mentioned
 */

/**
 * @typedef {object} GuildMember
 * @property {import("./Users").User} user - user belonging to the member
 * @property {?String} nick - nickname if the member has one
 * @property {String[]} roles - array of role ids
 * @property {string} joined_at - timestamp when the user joined the guild
 * @property {Boolean} deaf - if the user is deafened
 * @property {Boolean} mute - if the user is muted
 */

/**
 * @typedef {object} Ban
 * @property {?String} reason - reason of the ban
 * @property {import("./Users").User} user - user that was banned
 */

// those moves https://youtu.be/oCrwzN6eb4Q?t=51s nice
export = GuildMethods;
