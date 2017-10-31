const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
    /**
     * Create a new Guild Method Handler
     * @param {RequestHandler} requestHandler
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Create a new Guild, limited to 10 guilds (you may create more if you are whitelisted)
     * Check the (discord docs)[https://discordapp.com/developers/docs/resources/guild#get-guild-channels] for more infos
     * @param {Object} data
     * @param {String} data.name - name of the guild
     * @param {String} data.region - region id of the guild
     * @param {String} data.icon - base64 encoded jpeg icon to use for the guild
     * @param {Number} data.verification_level - guild verification level
     * @param {Number} data.default_message_notifications - default message [notification setting](https://discordapp.com/developers/docs/resources/guild#default-message-notification-level)
     * @param {Channel[]} data.channels - channels of the guild
     * @param {Role[]} data.roles - array of roles
     * @returns {Promise.<Guild>}
     */
    async createGuild(data) {
        return this.requestHandler.request(Endpoints.GUILDS, 'post', 'json', data);
    }

    /**
     * Get a guild via id
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Guild>}
     */
    async getGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'get', 'json');
    }

    /**
     * Update a guild
     * @param {String} guildId - id of the guild
     * @param {Object} data
     * @param {String} [data.name] - name of the guild
     * @param {String} [data.region] - guild voice region id
     * @param {Number} [data.verification_level] - guild verification level
     * @param {Number} [data.default_message_notifications] - message notification setting
     * @param {String} [data.afk_channel_id] - id of the afk channel
     * @param {Number} [data.afk_timeout] - afk timeout in seconds
     * @param {String} [data.icon] - base64 jpeg image of the guild icon
     * @param {String} [data.owner_id] - id of the owner user
     * @param {String} [data.splash] - base64 jpeg image for the guild splash (vip/partner only)
     * @returns {Promise.<Guild>}
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
     * @returns {Promise.<Channel[]>} - list of channels
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
     * @param {PermissionOverwrite[]} [data.permission_overwrites] -
     * @returns {Promise.<Channel>}
     */
    async createGuildChannel(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'post', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async updateChannelPositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'patch', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @returns {Promise.<Object>}
     */
    async getGuildMember(guildId, memberId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>}
     */
    async getGuildMembers(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param data
     * @returns {Promise.<Object>}
     */
    async addGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'put', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param data
     * @returns {Promise.<Object>}
     */
    async updateGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'patch', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async updateSelf(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_NICK(guildId, '@me'), 'patch', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param roleId
     * @returns {Promise.<Object>}
     */
    async addGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'put', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param roleId
     * @returns {Promise.<Object>}
     */
    async removeGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'delete', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param data
     * @returns {Promise.<Object>}
     */
    async removeGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'delete', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>}
     */
    async getGuildBans(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param data
     * @returns {Promise.<Object>}
     */
    async createGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'put', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param memberId
     * @param data
     * @returns {Promise.<Object>}
     */
    async removeGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'delete', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Role[]>}
     */
    async getGuildRoles(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Role>}
     */
    async createGuildRole(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'post', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async updateGuildRolePositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'put', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param roleId
     * @param data
     * @returns {Promise.<Role>}
     */
    async updateGuildRole(guildId, roleId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'patch', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param roleId
     * @returns {Promise.<Object>}
     */
    async removeGuildRole(guildId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'delete', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async getGuildPruneCount(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'get', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async startGuildPrune(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'post', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<VoiceRegion[]>}
     */
    async getGuildVoiceRegions(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Invite[]>}
     */
    async getGuildInvites(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>}
     */
    async getGuildIntegrations(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
     */
    async createGuildIntegration(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'post', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param integrationId
     * @param data
     * @returns {Promise.<Object>}
     */
    async updateGuildIntegration(guildId, integrationId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'patch', 'json', data);
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param integrationId
     * @returns {Promise.<Object>}
     */
    async removeGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param integrationId
     * @returns {Promise.<Object>}
     */
    async syncGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @returns {Promise.<Object>}
     */
    async getGuildEmbed(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), 'get', 'json');
    }

    /**
     *
     * @param {String} guildId - id of the guild
     * @param data
     * @returns {Promise.<Object>}
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
module.exports = GuildMethods;