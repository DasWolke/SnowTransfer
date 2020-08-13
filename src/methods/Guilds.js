const Endpoints = require("../Endpoints");

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
	/**
	 * Create a new Guild Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guild.method`, where `client` is an initialized SnowTransfer instance
	 * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
	 */
	constructor(requestHandler) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Create a new Guild, **limited to 10 guilds (you may create more if you are whitelisted)**
	 * Check the [discord docs](https://discord.com/developers/docs/resources/guild#create-guild) for more infos
	 * @param {object} data - data
	 * @param {string} data.name - name of the guild
	 * @param {string} [data.region] - [voice region](https://discord.com/developers/docs/resources/voice#voice-region-voice-region-structure)
	 * @param {string} [data.icon] - base64 encoded jpeg icon to use for the guild
	 * @param {number} [data.verification_level] - guild [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)
	 * @param {number} [data.default_message_notifications] - default message [notification setting](https://discord.com/developers/docs/resources/guild#default-message-notification-level)
	 * @param {import("./Channels").Channel[]} [data.channels] - array of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 * @param {Role[]} [data.roles] - array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 * @returns {Promise<Guild>} [Guild](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * @example
	 * // Creates a simple guild with the name "Demo Guild"
	 * let client = new SnowTransfer('TOKEN')
	 * let guildData = {
	 *   name: 'Demo Guild'
	 * }
	 * client.guild.createGuild(guildData)
	 */
	async createGuild(data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILDS, "post", "json", null, data);
	}

	/**
	 * Get a guild via Id
	 *
	 * **Your bot has to be a member of the guild for this function to work**
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<Guild>} [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 */
	async getGuild(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD(guildId), "get", "json");
	}

	/**
	 * Update a guild
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - data
	 * @param {string} [data.name] - name of the guild
	 * @param {string} [data.region] - guild [voice region](https://discord.com/developers/docs/resources/voice#voice-region-voice-region-structure) Id
	 * @param {number} [data.verification_level] - guild [verification level](https://discord.com/developers/docs/resources/guild#guild-object-verification-level)
	 * @param {number} [data.default_message_notifications] - message [notification setting](https://discord.com/developers/docs/resources/guild#default-message-notification-level)
	 * @param {string} [data.afk_channel_id] - Id of the afk channel
	 * @param {number} [data.afk_timeout] - afk timeout in seconds
	 * @param {string} [data.icon] - base64 jpeg image of the guild icon
	 * @param {string} [data.owner_id] - Id of the owner user
	 * @param {string} [data.splash] - base64 jpeg image for the guild splash (vip/partner only)
	 * @returns {Promise<Guild>} [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 *
	 * @example
	 * // Update the name of a guild to "Nice Guild"
	 * let client = new SnowTransfer('TOKEN')
	 * let guildData = {
	 *   name: 'Nice Guild'
	 * }
	 * client.guild.updateGuild('guild Id', guildData)
	 */
	async updateGuild(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD(guildId), "patch", "json", null, data);
	}

	/**
	 * Delete a guild
	 *
	 * **Your bot has to be the owner of the guild to do this**
	 *
	 * **This action is irreversible, so use it with caution!**
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 */
	async deleteGuild(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD(guildId), "delete", "json");
	}

	/**
	 * Get a list of channels for a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<import("./Channels").Channel[]>} - list of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 */
	async getGuildChannels(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "get", "json");
	}

	/**
	 * Create a channel within a guild
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - channel properties
	 * @param {string} data.name - name of the channel
	 * @param {number} [data.type] - [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of the channel
	 * @param {number} [data.bitrate] - bitrate of the channel (voice only)
	 * @param {number} [data.user_limit] - user limit of a channel (voice only)
	 * @param {import("./Channels").PermissionOverwrite[]} [data.permission_overwrites] - permissions overwrites for the channel
	 * @returns {Promise<import("./Channels").Channel>} [channel object](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|-----------:|
	 | MANAGE_CHANNELS    | always    |
	 */
	async createGuildChannel(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "post", "json", null, data);
	}

	/**
	 * Batch update the positions of channels
	 * @param {string} guildId - Id of the guild
	 * @param {Object[]} data
	 * @param {string} data[].id - Id of the channel
	 * @param {number} data[].position - new position of the channel
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 */
	async updateChannelPositions(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), "patch", "json", null, data);
	}

	/**
	 * Get a guild member via Id
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @returns {Promise<GuildMember>} - [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 */
	async getGuildMember(guildId, memberId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "get", "json");
	}

	/**
	 * Get a list of guild members
	 * @param {string} guildId - Id of the guild
	 * @param {object} [data] - query data
	 * @param {number} [data.limit] - how many results should be returned
	 * @param {string} [data.after] - highest user Id after which results should be returned
	 * @returns {Promise<GuildMember[]>} - list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 */
	async getGuildMembers(guildId, data = {}) {
		let futureKey = `get:${Endpoints.GUILD_MEMBERS(guildId)}:json:${data.limit}:${data.after}`;
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), "get", "json", futureKey, data);
	}

	/**
	 * Add a guild member to a guild via oauth2 access token
	 *
	 * **You need the oauth2 `guilds.join` scope granted to the access_token**
	 *
	 *
	 * **Your bot has to be a member of the guild you want to add the user to**
	 *
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {object} data - object containing the needed request data
	 * @param {string} data.access_token - oauth2 access token with a `guilds.join` scope enabled
	 * @param {string} [data.nick] - nickname of the new member
	 * @param {String[]} [data.roles] - Array of Role Ids the new member should have
	 * @param {Boolean} [data.mute] - if the new member should be muted
	 * @param {Boolean} [data.deaf] - if the new member is deaf
	 * @returns {Promise<GuildMember>} - [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
	 *
	 * | Permissions needed    | condition |
	 |-----------------------|----------:|
	 | CREATE_INSTANT_INVITE |    always |
	 *
	 * | OAUTH2 Scopes |
	 |---------------|
	 | guilds.join   |
	 *
	 * @example
	 * // add a user to a server
	 * let client = new SnowTransfer('TOKEN')
	 * let memberData = {
	 *   access_token: 'access token of a user with the guilds.join scope'
	 * }
	 * client.guild.addGuildMember('guildId', 'memberId', memberData)
	 */
	async addGuildMember(guildId, memberId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "put", "json", null, data);
	}

	/**
	 * Update properties of a guild member
	 *
	 * **Check the table below to make sure you have the right permissions for the types of updates**
	 *
	 * **Make sure that your bot has `CONNECT` and `MOVE_MEMBERS` on the channel you want to move the member to**
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {object} data - Updated properties
	 * @param {string} [data.nick] - updated nickname of the member (MANAGE_NICKNAMES)
	 * @param {String[]} [data.roles] - Array of Role Ids the member should have (MANAGE_ROLES)
	 * @param {Boolean} [data.mute] - if the member should be muted (MUTE_MEMBERS)
	 * @param {Boolean} [data.deaf] - if the member is deaf (DEAFEN_MEMBERS)
	 * @param {string} [data.channel_id] - channel to move the member to (if connected to voice) (CONNECT and MOVE_MEMBERS)
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed |    condition |
	 |--------------------|-------------:|
	 | MANAGE_NICKNAMES   | Nick Updates |
	 | MANAGE_ROLES       | Role Updates |
	 | MUTE_MEMBERS       | Mute Updates |
	 | DEAFEN_MEMBERS     | Deaf Updates |
	 | MOVE_MEMBERS       | Voice Move   |
	 *
	 * @example
	 * // Reset the nickname of a guild member
	 * let client = new SnowTransfer('TOKEN')
	 * let memberData = {
	 *   nick: "" // You can reset nicknames by providing an empty string as the value of data.nick
	 * }
	 * client.guild.updateGuildMember('guild Id', 'memberId', memberData)
	 */
	async updateGuildMember(guildId, memberId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "patch", "json", null, data);
	}

	/**
	 * Update the nick of the current user
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - object with a nick property
	 * @param {string} data.nick - new nickname to use
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | CHANGE_NICKNAME    |    always |
	 *
	 * @example
	 * // change nick of bot to "Nice Nick"
	 * let client = new SnowTransfer('TOKEN')
	 * let nickData = {
	 *   nick: 'Nice Nick'
	 * }
	 * client.guild.updateSelf('guildId', nickData)
	 */
	async updateSelf(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_NICK(guildId, "@me"), "patch", "json", null, data);
	}

	/**
	 * Add a role to a guild member
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {string} roleId - Id of the role
	 * @param {object} [data] - object with reason property
	 * @param {string} [data.reason] - Audit log reason for the remove
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async addGuildMemberRole(guildId, memberId, roleId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "put", "json", null, data);
	}

	/**
	 * Remove a role from a guild member
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {string} roleId - Id of the role
	 * @param {object} [data] - object with reason property
	 * @param {string} [data.reason] - Audit log reason for the remove
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async removeGuildMemberRole(guildId, memberId, roleId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "delete", "json", null, data);
	}

	/**
	 * Remove a guild member (aka kick them)
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {object} [data] - object with reason property
	 * @param {string} [data.reason] - Audit log reason for the remove
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 *| Permissions needed | condition |
	 |--------------------|----------:|
	 | KICK_MEMBERS       |    always |
	 *
	 * @example
	 * // Kick a member with a reason of "spam"
	 * let client = new SnowTransfer('TOKEN')
	 * let kickData = {
	 *   reason: 'spam'
	 * }
	 * client.guild.removeGuildMember('guild Id', 'memberId', kickData)
	 */
	async removeGuildMember(guildId, memberId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), "delete", "json", null, data);
	}

	/**
	 * Get bans of a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<Ban[]>} - List of [bans](https://discord.com/developers/docs/resources/guild#ban-object-ban-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | BAN_MEMBERS        |    always |
	 */
	async getGuildBans(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), "get", "json");
	}

	/**
	 * Ban a guild member
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {object} [data] - object with a reason and a delete-message-days property
	 * @param {string} [data.reason] - Audit log reason for the ban
	 * @param {number} [data.delete_message_days] - Number of Days of messages that should be removed
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | BAN_MEMBERS        |    always |
	 *
	 * @example
	 * // Ban a user with a reason and delete the last 2 days of his messages
	 * let client = new SnowTransfer('TOKEN')
	 * let banData = {
	 *   reason: 'Memes were not good enough',
	 *   "delete-message-days":2
	 * }
	 * client.guild.createGuildBan('guild Id', 'memberId', banData)
	 */
	async createGuildBan(guildId, memberId, data) {
		let newData = {};
		newData.queryReason = data.reason;
		newData["delete-message-days"] = data.delete_message_days;
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), "put", "json", null, newData);
	}

	/**
	 * Remove a ban of a user
	 * @param {string} guildId - Id of the guild
	 * @param {string} memberId - Id of the guild member
	 * @param {object} [data] - object with a reason property
	 * @param {string} [data.reason] - Audit log reason for the remove of the ban
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | BAN_MEMBERS        |    always |
	 */
	async removeGuildBan(guildId, memberId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), "delete", "json", null, data);
	}

	/**
	 * Get a list of roles for a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<Role[]>} - array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async getGuildRoles(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "get", "json");
	}

	/**
	 * Create a new Role
	 * @param {string} guildId - Id of the guild
	 * @param {object} [data] - data with role properties
	 * @param {string} [data.name] - name of the role
	 * @param {number} [data.permissions] - Number created from combining permission bits
	 * @param {number} [data.color] - rgb color of the role
	 * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
	 * @param {Boolean} [data.mentionable] - if the role should be mentionable
	 * @returns {Promise<Role>} [role](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
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
	async createGuildRole(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "post", "json", null, data);
	}

	/**
	 * Batch modify the positions of roles
	 * @param {string} guildId - Id of the guild
	 * @param {Object[]} data - Array of objects with id and position properties
	 * @param {string} data[].id - Id of the role
	 * @param {number} data[].position - new position of the role
	 * @returns {Promise<Role[]>} - array of [roles](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async updateGuildRolePositions(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), "put", "json", null, data);
	}

	/**
	 * Update a guild role
	 * @param {string} guildId - Id of the guild
	 * @param {string} roleId - Id of the role
	 * @param {object} data - updated properties of the role
	 * @param {string} [data.name] - new name of the role
	 * @param {number} [data.permissions] - updated permission bit-set
	 * @param {number} [data.color] - rgb color of the role
	 * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
	 * @param {Boolean} [data.mentionable] - if the role should be mentionable
	 * @returns {Promise<Role>} [Updated Role](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async updateGuildRole(guildId, roleId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), "patch", "json", null, data);
	}

	/**
	 * Delete a role from the guild
	 * @param {string} guildId - Id of the guild
	 * @param {string} roleId - Id of the role
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_ROLES       |    always |
	 */
	async removeGuildRole(guildId, roleId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), "delete", "json");
	}

	/**
	 * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - Object with a days property
	 * @param {number} data.days - days to count prune for (min 1)
	 * @returns {Promise<object>} - Object with a "pruned" key indicating the amount of members that would be pruned
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | KICK_MEMBERS       |    always |
	 */
	async getGuildPruneCount(guildId, data) {
		let futureKey = `get:${Endpoints.GUILD_PRUNE(guildId)}:json:${data.days}`;
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), "get", "json", futureKey, data);
	}

	/**
	 * Start a prune
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - Object with a days property
	 * @param {number} data.days - days to count prune for (min 1)
	 * @returns {Promise<object>} Object with a "pruned" key indicating the amount of members that were be pruned
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | KICK_MEMBERS       |    always |
	 */
	async startGuildPrune(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), "post", "json", null, data);
	}

	/**
	 * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<import("./Voices").VoiceRegion[]>} List of [voice regions](https://discord.com/developers/docs/resources/voice#voice-region-object)
	 */
	async getGuildVoiceRegions(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), "get", "json");
	}

	/**
	 * Get invites for a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<import("./Invites").Invite[]>} List of [invites](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async getGuildInvites(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), "get", "json");
	}

	/**
	 * Get integrations for a guild
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<Object[]>} List of [integration objects](https://discord.com/developers/docs/resources/guild#integration-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async getGuildIntegrations(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), "get", "json");
	}

	/**
	 * Attach a integration object from the user to the guild
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - Integration object with id and type properties
	 * @param {string} data.type - type of the integration
	 * @param {string} data.id - Id of the integration
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async createGuildIntegration(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), "post", "json", null, data);
	}

	/**
	 * Update behaviour and settings of an [integration object](https://discord.com/developers/docs/resources/guild#integration-object)
	 * @param {string} guildId - Id of the guild
	 * @param {string} integrationId - Id of the integration
	 * @param {object} data - Data with the properties listed below
	 * @param {number} data.expire_behaviour - Behaviour when a integration subscription expires
	 * @param {number} data.expire_grace_period - Time in seconds for how long to ignore expired subscriptions
	 * @param {Boolean} data.enable_emoticons - If emoticons should be synced for this integration (twitch only atm)
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async updateGuildIntegration(guildId, integrationId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "patch", "json", null, data);
	}

	/**
	 * Delete a guild integratiom
	 * @param {string} guildId - Id of the guild
	 * @param {string} integrationId - Id of the integration
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async removeGuildIntegration(guildId, integrationId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
	}

	/**
	 * Synchronize a guild integration
	 * @param {string} guildId - Id of the guild
	 * @param {string} integrationId - Id of the integration
	 * @returns {Promise<void>} Resolves the Promise on successful execution
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async syncGuildIntegration(guildId, integrationId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
	}

	/**
	 * Get the guild embed object
	 * @param {string} guildId - Id of the guild
	 * @returns {Promise<object>} [Guild Embed](https://discord.com/developers/docs/resources/guild#guild-embed-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async getGuildEmbed(guildId) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), "get", "json");
	}

	/**
	 * Update a guild embed object
	 * @param {string} guildId - Id of the guild
	 * @param {object} data - data
	 * @param {Boolean} data.enabled - if the embed is enabled
	 * @param {string} data.channel_id - channel Id of the embed
	 * @returns {Promise<object>} - [Guild Embed](https://discord.com/developers/docs/resources/guild#guild-embed-object)
	 *
	 * | Permissions needed | condition |
	 |--------------------|----------:|
	 | MANAGE_GUILD       |    always |
	 */
	async updateGuildEmbed(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), "patch", "json", null, data);
	}

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
module.exports = GuildMethods;
