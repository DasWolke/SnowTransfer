const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
    /**
     * Create a new Guild Method Handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Create a new Guild, limited to 10 guilds (you may create more if you are whitelisted)
     * Check the [discord docs](https://discordapp.com/developers/docs/resources/guild#create-guild) for more infos
     * @param {Object} data - data
     * @param {String} data.name - name of the guild
     * @param {String} data.region - [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-voice-region-structure) id of the guild
     * @param {String} data.icon - base64 encoded jpeg icon to use for the guild
     * @param {Number} data.verification_level - guild [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level)
     * @param {Number} data.default_message_notifications - default message [notification setting](https://discordapp.com/developers/docs/resources/guild#default-message-notification-level)
     * @param {Channel[]} data.channels - array of [channels](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     * @param {Role[]} data.roles - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     * @returns {Promise.<Guild>} - [Guild](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async createGuild(data) {
        return this.requestHandler.request(Endpoints.GUILDS, 'post', 'json', data);
    }

    /**
     * Get a guild via id
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Guild>} - [Guild](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async getGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'get', 'json');
    }

    /**
     * Update a guild
     * @param {String} guildId - id of the guild
     * @param {Object} data - data
     * @param {String} [data.name] - name of the guild
     * @param {String} [data.region] - guild [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-voice-region-structure) id
     * @param {Number} [data.verification_level] - guild [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level)
     * @param {Number} [data.default_message_notifications] - message [notification setting](https://discordapp.com/developers/docs/resources/guild#default-message-notification-level)
     * @param {String} [data.afk_channel_id] - id of the afk channel
     * @param {Number} [data.afk_timeout] - afk timeout in seconds
     * @param {String} [data.icon] - base64 jpeg image of the guild icon
     * @param {String} [data.owner_id] - id of the owner user
     * @param {String} [data.splash] - base64 jpeg image for the guild splash (vip/partner only)
     * @returns {Promise.<Guild>} - [Guild](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    async updateGuild(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'patch', 'json', data);
    }

    /**
     * Delete a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise}
     */
    async deleteGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'delete', 'json');
    }

    /**
     * Get a list of channels for a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Channel[]>} - list of [channels](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async getGuildChannels(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'get', 'json');
    }

    /**
     * Create a channel within a guild
     * @param {String} guildId - id of the guild
     * @param {Object} data
     * @param {String} data.name - name of the channel
     * @param {Number} [data.type] - [type](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-types) of the channel
     * @param {Number} [data.bitrate] - bitrate of the channel (voice only)
     * @param {Number} [data.user_limit] - user limit of a channel (voice only)
     * @param {PermissionOverwrite[]} [data.permission_overwrites] - permissions overwrites for the channel
     * @returns {Promise.<Channel>} [channel object](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async createGuildChannel(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'post', 'json', data);
    }

    /**
     * Batch update the positions of channels
     * @param {String} guildId - id of the guild
     * @param {Object[]} data
     * @param {String} data[].id - id of the channel
     * @param {Number} data[].position - new position of the channel
     * @returns {Promise.<void>}
     */
    async updateChannelPositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'patch', 'json', data);
    }

    /**
     * Get a guild member via id
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @returns {Promise.<GuildMember>} - [guild member](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    async getGuildMember(guildId, memberId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'get', 'json');
    }

    /**
     * Get a list of guild members
     * @param {String} guildId - id of the guild
     * @param {Object} [data]
     * @param {Number} [data.limit] - how many results should be returned
     * @param {String} [data.after] - highest user id after which results should be returned
     * @returns {Promise.<GuildMember[]>} - list of [guild members](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    async getGuildMembers(guildId, data = {}) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), 'get', 'json', data);
    }

    /**
     * Add a guild member to a guild via oauth2 access token
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {Object} data
     * @param {String} data.access_token - oauth2 access token with a `guilds.join` scope enabled
     * @param {String} [data.nick] - nickname of the new member
     * @param {String[]} [data.roles] - array of roles the new member should have
     * @param {Boolean} [data.mute] - if the new member should be muted
     * @param {Boolean} [data.deaf] - if the new member is deaf
     * @returns {Promise.<GuildMember>} - [guild member](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    async addGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'put', 'json', data);
    }

    /**
     * Update a guild member
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {Object} data
     * @param {String} [data.nick] - nickname of the member
     * @param {String[]} [data.roles] - array of roles the member should have
     * @param {Boolean} [data.mute] - if the member should be muted
     * @param {Boolean} [data.deaf] - if the member is deaf
     * @param {String} [data.channel_id] - channel to move the member to (if connected to voice)
     * @returns {Promise.<void>}
     */
    async updateGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'patch', 'json', data);
    }

    /**
     * Update the nick of the current user
     * @param {String} guildId - id of the guild
     * @param {Object} data
     * @param {String} data.nick - new nickname to use
     * @returns {Promise.<void>}
     */
    async updateSelf(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_NICK(guildId, '@me'), 'patch', 'json', data);
    }

    /**
     * Add a role to a guild member
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {String} roleId - id of the role
     * @returns {Promise.<void>}
     */
    async addGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'put', 'json');
    }

    /**
     * Remove a role from a guild member
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {String} roleId - id of the role
     * @returns {Promise.<void>}
     */
    async removeGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'delete', 'json');
    }

    /**
     * Remove a guild member
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {Object} [data]
     * @param {String} [data.reason] - Audit log reason for the remove
     * @returns {Promise.<void>}
     */
    async removeGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'delete', 'json', data);
    }

    /**
     * Get bans of the guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Ban[]>} - list of [bans](https://discordapp.com/developers/docs/resources/guild#ban-object-ban-structure)
     */
    async getGuildBans(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), 'get', 'json');
    }

    /**
     * Ban a guild member
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {Object} [data]
     * @param {String} [data.reason] - Audit log reason for the ban
     * @param {Number} [data.delete-message-days] - Number of Days of messages that should be removed
     * @returns {Promise.<void>}
     */
    async createGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'put', 'json', data);
    }

    /**
     * Remove a ban of a user
     * @param {String} guildId - id of the guild
     * @param {String} memberId - id of the guild member
     * @param {Object} [data]
     * @param {String} [data.reason] - Audit log reason for the ban remove
     * @returns {Promise.<void>}
     */
    async removeGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'delete', 'json', data);
    }

    /**
     * Get a list of roles for a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Role[]>} - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async getGuildRoles(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'get', 'json');
    }

    /**
     * Create a new Role
     * @param {String} guildId - id of the guild
     * @param {Object} [data]
     * @param {String} [data.name] - name of the role
     * @param {Number} [data.permissions] - Number created from combining permission bits
     * @param {Number} [data.color] - rgb color of the role
     * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
     * @param {Boolean} [data.mentionable] - if the role should be mentionable
     * @returns {Promise.<Role>} [role](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async createGuildRole(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'post', 'json', data);
    }

    /**
     * Batch modify the positions of roles
     * @param {String} guildId - id of the guild
     * @param {Object[]} data
     * @param {String} data[].id - id of the role
     * @param {Number} data[].position - new position of the role
     * @returns {Promise.<Role[]>} - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async updateGuildRolePositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'put', 'json', data);
    }

    /**
     * Update a guild role
     * @param {String} guildId - id of the guild
     * @param {String} roleId - id of the role
     * @param {Object} data - data
     * @param {String} [data.name] - new name of the role
     * @param {Number} [data.permissions] - updated permission bit-set
     * @param {Number} [data.color] - rgb color of the role
     * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
     * @param {Boolean} [data.mentionable] - if the role should be mentionable
     * @returns {Promise.<Role>} [role](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    async updateGuildRole(guildId, roleId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'patch', 'json', data);
    }

    /**
     * Remove a role
     * @param {String} guildId - id of the guild
     * @param {String} roleId - id of the role
     * @returns {Promise.<void>}
     */
    async removeGuildRole(guildId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'delete', 'json');
    }

    /**
     * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
     * @param {String} guildId - id of the guild
     * @param {Object} data - data
     * @param {Number} data.days - days to count prune for (min 1)
     * @returns {Promise.<Object>} - Object with a "pruned" key indicating the amount of members that would be pruned
     */
    async getGuildPruneCount(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'get', 'json', data);
    }

    /**
     * Start a prune
     * @param {String} guildId - id of the guild
     * @param {Object} data - data
     * @param {Number} data.days - days to count prune for (min 1)
     * @returns {Promise.<Object>}- Object with a "pruned" key indicating the amount of members that were be pruned
     */
    async startGuildPrune(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'post', 'json', data);
    }

    /**
     * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
     * @param {String} guildId - id of the guild
     * @returns {Promise.<VoiceRegion[]>} - list of [voice regions](https://discordapp.com/developers/docs/resources/voice#voice-region-object)
     */
    async getGuildVoiceRegions(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), 'get', 'json');
    }

    /**
     * Get invites for a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Invite[]>} - list of [invites](https://discordapp.com/developers/docs/resources/invite#invite-object) (with metadata)
     */
    async getGuildInvites(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), 'get', 'json');
    }

    /**
     * Get integrations for a guild
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object[]>} - list of [integration objects](https://discordapp.com/developers/docs/resources/guild#integration-object)
     */
    async getGuildIntegrations(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'get', 'json');
    }

    /**
     * Attach a integration object from the user to the guild
     * @param {String} guildId - id of the guild
     * @param {Object} data - data
     * @param {String} data.type - type of the integration
     * @param {String} data.id - id of the integration
     * @returns {Promise.<void>}
     */
    async createGuildIntegration(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'post', 'json', data);
    }

    /**
     * Update behaviour and settings of an [integration object](https://discordapp.com/developers/docs/resources/guild#integration-object)
     * @param {String} guildId - id of the guild
     * @param {String} integrationId - id of the integration
     * @param {Object} data - data
     * @param {Number} data.expire_behaviour - Behaviour when a integration subscription expires
     * @param {Number} data.expire_grace_period - Time in seconds for how long to ignore expired subscriptions
     * @param {Boolean} data.enable_emoticons - If emoticons should be synced for this integration (twitch only atm)
     * @returns {Promise.<void>}
     */
    async updateGuildIntegration(guildId, integrationId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'patch', 'json', data);
    }

    /**
     * Deletes a guild integratiom
     * @param {String} guildId - id of the guild
     * @param {String} integrationId - id of the integration
     * @returns {Promise.<Object>}
     */
    async removeGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    /**
     * Synchronize a guild integration
     * @param {String} guildId - id of the guild
     * @param {String} integrationId - id of the integration
     * @returns {Promise.<void>}
     */
    async syncGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    /**
     * Get the guild embed object
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>} - [guild embed](https://discordapp.com/developers/docs/resources/guild#guild-embed-object)
     */
    async getGuildEmbed(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), 'get', 'json');
    }

    /**
     * Update a guild embed object
     * @param {String} guildId - id of the guild
     * @param {Object} data - data
     * @param {Boolean} data.enabled - if the embed is enabled
     * @param {String} data.channel_id - channel id of the embed
     * @returns {Promise.<Object>} - [guild embed](https://discordapp.com/developers/docs/resources/guild#guild-embed-object)
     */
    async updateGuildEmbed(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), 'patch', 'json', data);
    }

}

/**
 * @typedef {Object} Guild
 * @property {String} id - guild id
 * @property {String} name - guild name
 * @property {String} icon - icon hash
 * @property {String} splash - splash image hash
 * @property {String} owner_id - id of the owner
 * @property {String} region - id of the voice region
 * @property {String} afk_channel_id - id of the afk channel
 * @property {Number} afk_timeout - afk timeout in seconds
 * @property {Boolean} embed_enabled - if the guild is embeddable
 * @property {String} embed_channel_id - id of embedded channel
 * @property {Number} verification level - [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level) of the guild
 * @property {Number} default_message_notifications - default
 * [notification level](https://discordapp.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of the guild
 * @property {Number} explicit_content_filter - default [filter level](https://discordapp.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level)
 * @property {Role[]} roles - Array of roles
 * @property {Emoji[]} emojis - Array of emojis
 * @property {String[]} features - Array of enabled guild features
 * @property {Number} mfa_level - required [mfa level](https://discordapp.com/developers/docs/resources/guild#guild-object-mfa-level) for the guild
 * @property {String} [application_id] - application id of the guild creator, if the guild was created by a bot
 * @property {Boolean} widget_enabled - if the server widget is enabled
 * @property {String} widget_channel_id - channel id of the server widget
 */

/**
 * @typedef {Object} Role
 * @property {String} id - role id
 * @property {String} name - role name
 * @property {Number} color - integer representation of hexadecimal color code
 * @property {Boolean} hoist - if this role is hoisted
 * @property {Number} position - position of the role
 * @property {Number} permissions - permission bit set
 * @property {Boolean} managed - if this role is managed by an integration
 * @property {Boolean} mentionable - if this role can be mentioned
 */

/**
 * @typedef {Object} GuildMember
 * @property {User} user - user belonging to the member
 * @property {?String} nick - nickname if the member has one
 * @property {String[]} roles - array of role ids
 * @property {String} joined_at - timestamp when the user joined the guild
 * @property {Boolean} deaf - if the user is deafened
 * @property {Boolean} mute - if the user is muted
 */

/**
 * @typedef {Object} Ban
 * @property {?String} reason - reason of the ban
 * @property {User} user - user that was banned
 */

// those moves https://youtu.be/oCrwzN6eb4Q?t=51s nice
module.exports = GuildMethods;