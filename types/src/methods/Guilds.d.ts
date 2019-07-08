import RequestHandler from "../RequestHandler";
import { TBan, TChannel, TGuild, TGuildMember, TPermissionOverwrite, TRole, TInvite, TVoiceRegion, TGuildEmbed } from "../LibTypes";
/**
 * Methods for interacting with Guilds
 */
declare class GuildMethods {
    private requestHandler;
    /**
     * Create a new Guild Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.guild.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Create a new Guild, **limited to 10 guilds (you may create more if you are whitelisted)**
     * Check the [discord docs](https://discordapp.com/developers/docs/resources/guild#create-guild) for more infos
     * @param {Object} data - data
     * @param {String} data.name - name of the guild
     * @param {String} [data.region] - [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-voice-region-structure)
     * @param {String} [data.icon] - base64 encoded jpeg icon to use for the guild
     * @param {Number} [data.verification_level] - guild [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level)
     * @param {Number} [data.default_message_notifications] - default message [notification setting](https://discordapp.com/developers/docs/resources/guild#default-message-notification-level)
     * @param {Channel[]} [data.channels] - array of [channels](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     * @param {Role[]} [data.roles] - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     * @returns {Promise.<Guild>} [Guild](https://discordapp.com/developers/docs/resources/guild#guild-object)
     *
     * @example
     * // Creates a simple guild with the name "Demo Guild"
     * let client = new SnowTransfer('TOKEN')
     * let guildData = {
     *   name: 'Demo Guild'
     * }
     * client.guild.createGuild(guildData)
     */
    createGuild(data: string): Promise<TGuild>;
    /**
     * Get a guild via Id
     *
     * **Your bot has to be a member of the guild for this function to work**
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Guild>} [Guild object](https://discordapp.com/developers/docs/resources/guild#guild-object)
     */
    getGuild(guildId: string): Promise<TGuild>;
    /**
     * Update a guild
     * @param {String} guildId - Id of the guild
     * @param {Object} data - data
     * @param {String} [data.name] - name of the guild
     * @param {String} [data.region] - guild [voice region](https://discordapp.com/developers/docs/resources/voice#voice-region-voice-region-structure) Id
     * @param {Number} [data.verification_level] - guild [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level)
     * @param {Number} [data.default_message_notifications] - message [notification setting](https://discordapp.com/developers/docs/resources/guild#default-message-notification-level)
     * @param {String} [data.afk_channel_id] - Id of the afk channel
     * @param {Number} [data.afk_timeout] - afk timeout in seconds
     * @param {String} [data.icon] - base64 jpeg image of the guild icon
     * @param {String} [data.owner_id] - Id of the owner user
     * @param {String} [data.splash] - base64 jpeg image for the guild splash (vip/partner only)
     * @returns {Promise.<Guild>} [Guild object](https://discordapp.com/developers/docs/resources/guild#guild-object)
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
    updateGuild(guildId: string, data: {
        region?: string;
        verification_level?: number;
        default_message_notifications?: number;
        afk_channel_id?: string;
        afk_timeout?: number;
        icon?: string;
        owner_id?: string;
        splash?: string;
    }): Promise<TGuild>;
    /**
     * Delete a guild
     *
     * **Your bot has to be the owner of the guild to do this**
     *
     * **This action is irreversible, so use it with caution!**
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    deleteGuild(guildId: string): Promise<void>;
    /**
     * Get a list of channels for a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Channel[]>} - list of [channels](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    getGuildChannels(guildId: string): Promise<TChannel[]>;
    /**
     * Create a channel within a guild
     * @param {String} guildId - Id of the guild
     * @param {Object} data - channel properties
     * @param {String} data.name - name of the channel
     * @param {Number} [data.type] - [type](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-types) of the channel
     * @param {Number} [data.bitrate] - bitrate of the channel (voice only)
     * @param {Number} [data.user_limit] - user limit of a channel (voice only)
     * @param {PermissionOverwrite[]} [data.permission_overwrites] - permissions overwrites for the channel
     * @returns {Promise.<Channel>} [channel object](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_CHANNELS    | always    |
     */
    createGuildChannel(guildId: string, data: {
        type?: number;
        bitrate?: number;
        user_limit?: number;
        permission_overwrites: TPermissionOverwrite[];
    }): Promise<TChannel>;
    /**
     * Batch update the positions of channels
     * @param {String} guildId - Id of the guild
     * @param {Object[]} data
     * @param {String} data[].id - Id of the channel
     * @param {Number} data[].position - new position of the channel
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     */
    updateChannelPositions(guildId: string, data: Array<{
        id: string;
        position: number;
    }>): Promise<void>;
    /**
     * Get a guild member via Id
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @returns {Promise.<GuildMember>} - [guild member](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    getGuildMember(guildId: string, memberId: string): Promise<TGuildMember>;
    /**
     * Get a list of guild members
     * @param {String} guildId - Id of the guild
     * @param {Object} [data] - query data
     * @param {Number} [data.limit] - how many results should be returned
     * @param {String} [data.after] - highest user Id after which results should be returned
     * @returns {Promise.<GuildMember[]>} - list of [guild members](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    getGuildMembers(guildId: string, data?: {
        limit?: number;
        after?: string;
    }): Promise<TGuildMember[]>;
    /**
     * Add a guild member to a guild via oauth2 access token
     *
     * **You need the oauth2 `guilds.join` scope granted to the access_token**
     *
     *
     * **Your bot has to be a member of the guild you want to add the user to**
     *
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {Object} data - object containing the needed request data
     * @param {String} data.access_token - oauth2 access token with a `guilds.join` scope enabled
     * @param {String} [data.nick] - nickname of the new member
     * @param {String[]} [data.roles] - Array of Role Ids the new member should have
     * @param {Boolean} [data.mute] - if the new member should be muted
     * @param {Boolean} [data.deaf] - if the new member is deaf
     * @returns {Promise.<GuildMember>} - [guild member](https://discordapp.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
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
    addGuildMember(guildId: string, memberId: string, data: {
        access_token: string;
        nick?: string;
        roles?: string[];
        mute?: boolean;
        deaf?: boolean;
    }): Promise<TGuildMember>;
    /**
     * Update properties of a guild member
     *
     * **Check the table below to make sure you have the right permissions for the types of updates**
     *
     * **Make sure that your bot has `CONNECT` and `MOVE_MEMBERS` on the channel you want to move the member to**
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {Object} data - Updated properties
     * @param {String} [data.nick] - updated nickname of the member (MANAGE_NICKNAMES)
     * @param {String[]} [data.roles] - Array of Role Ids the member should have (MANAGE_ROLES)
     * @param {Boolean} [data.mute] - if the member should be muted (MUTE_MEMBERS)
     * @param {Boolean} [data.deaf] - if the member is deaf (DEAFEN_MEMBERS)
     * @param {String} [data.channel_id] - channel to move the member to (if connected to voice) (CONNECT and MOVE_MEMBERS)
     * @returns {Promise.<void>} Resolves the Promise on successful execution
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
    updateGuildMember(guildId: string, memberId: string, data: {
        nick?: string;
        roles?: string[];
        mute?: boolean;
        deaf?: boolean;
        channel_id?: string;
    }): Promise<void>;
    /**
     * Update the nick of the current user
     * @param {String} guildId - Id of the guild
     * @param {Object} data - object with a nick property
     * @param {String} data.nick - new nickname to use
     * @returns {Promise.<void>} Resolves the Promise on successful execution
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
    updateSelf(guildId: string, data: {
        nick: string;
    }): Promise<void>;
    /**
     * Add a role to a guild member
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {String} roleId - Id of the role
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    addGuildMemberRole(guildId: string, memberId: string, roleId: string): Promise<void>;
    /**
     * Remove a role from a guild member
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {String} roleId - Id of the role
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    removeGuildMemberRole(guildId: string, memberId: string, roleId: string): Promise<void>;
    /**
     * Remove a guild member (aka kick them)
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {Object} [data] - object with reason property
     * @param {String} [data.reason] - Audit log reason for the remove
     * @returns {Promise.<void>} Resolves the Promise on successful execution
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
    removeGuildMember(guildId: string, memberId: string, data?: {
        reason?: string;
    }): Promise<void>;
    /**
     * Get bans of a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Ban[]>} - List of [bans](https://discordapp.com/developers/docs/resources/guild#ban-object-ban-structure)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | BAN_MEMBERS        |    always |
     */
    getGuildBans(guildId: string): Promise<TBan[]>;
    /**
     * Ban a guild member
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {Object} [data] - object with a reason and a delete-message-days property
     * @param {String} [data.reason] - Audit log reason for the ban
     * @param {Number} [data.delete-message-days] - Number of Days of messages that should be removed
     * @returns {Promise.<void>} Resolves the Promise on successful execution
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
    createGuildBan(guildId: string, memberId: string, data?: {
        reason?: string;
        "delete-message-days"?: number;
    }): Promise<void>;
    /**
     * Remove a ban of a user
     * @param {String} guildId - Id of the guild
     * @param {String} memberId - Id of the guild member
     * @param {Object} [data] - object with a reason property
     * @param {String} [data.reason] - Audit log reason for the remove of the ban
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | BAN_MEMBERS        |    always |
     */
    removeGuildBan(guildId: string, memberId: string, data?: {
        reasion: string;
    }): Promise<void>;
    /**
     * Get a list of roles for a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Role[]>} - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    getGuildRoles(guildId: string): Promise<TRole[]>;
    /**
     * Create a new Role
     * @param {String} guildId - Id of the guild
     * @param {Object} [data] - data with role properties
     * @param {String} [data.name] - name of the role
     * @param {Number} [data.permissions] - Number created from combining permission bits
     * @param {Number} [data.color] - rgb color of the role
     * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
     * @param {Boolean} [data.mentionable] - if the role should be mentionable
     * @returns {Promise<Role>} [role](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
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
    createGuildRole(guildId: string, data?: {
        name?: string;
        permissions?: number;
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
    }): Promise<TRole>;
    /**
     * Batch modify the positions of roles
     * @param {String} guildId - Id of the guild
     * @param {Object[]} data - Array of objects with id and position properties
     * @param {String} data[].id - Id of the role
     * @param {Number} data[].position - new position of the role
     * @returns {Promise.<Role[]>} - array of [roles](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    updateGuildRolePositions(guildId: string, data: Array<{
        id: string;
        position: string;
    }>): Promise<TRole[]>;
    /**
     * Update a guild role
     * @param {String} guildId - Id of the guild
     * @param {String} roleId - Id of the role
     * @param {Object} data - updated properties of the role
     * @param {String} [data.name] - new name of the role
     * @param {Number} [data.permissions] - updated permission bit-set
     * @param {Number} [data.color] - rgb color of the role
     * @param {Boolean} [data.hoist] - if the role should be displayed in the sidebar
     * @param {Boolean} [data.mentionable] - if the role should be mentionable
     * @returns {Promise.<Role>} [Updated Role](https://discordapp.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    updateGuildRole(guildId: string, roleId: string, data: {
        name?: string;
        permissions?: number;
        color?: number;
        hoist?: boolean;
        mentionable?: boolean;
    }): Promise<TRole>;
    /**
     * Delete a role from the guild
     * @param {String} guildId - Id of the guild
     * @param {String} roleId - Id of the role
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_ROLES       |    always |
     */
    removeGuildRole(guildId: string, roleId: string): Promise<void>;
    /**
     * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
     * @param {String} guildId - Id of the guild
     * @param {Object} data - Object with a days property
     * @param {Number} data.days - days to count prune for (min 1)
     * @returns {Promise.<Object>} - Object with a "pruned" key indicating the amount of members that would be pruned
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | KICK_MEMBERS       |    always |
     */
    getGuildPruneCount(guildId: string, data: {
        days: number;
        compute_prune_count: boolean;
    }): Promise<{
        pruned: number | null;
    }>;
    /**
     * Start a prune
     * @param {String} guildId - Id of the guild
     * @param {Object} data - Object with a days property
     * @param {Number} data.days - days to count prune for (min 1)
     * @returns {Promise.<Object>} Object with a "pruned" key indicating the amount of members that were be pruned
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | KICK_MEMBERS       |    always |
     */
    startGuildPrune(guildId: string, data: {
        days: number;
        compute_prune_count: boolean;
    }): Promise<{
        pruned: number | null;
    }>;
    /**
     * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<VoiceRegion[]>} List of [voice regions](https://discordapp.com/developers/docs/resources/voice#voice-region-object)
     */
    getGuildVoiceRegions(guildId: string): Promise<TVoiceRegion[]>;
    /**
     * Get invites for a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Invite[]>} List of [invites](https://discordapp.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    getGuildInvites(guildId: string): Promise<TInvite[]>;
    /**
     * Get integrations for a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Object[]>} List of [integration objects](https://discordapp.com/developers/docs/resources/guild#integration-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    getGuildIntegrations(guildId: string): Promise<Object>;
    /**
     * Attach a integration object from the user to the guild
     * @param {String} guildId - Id of the guild
     * @param {Object} data - Integration object with id and type properties
     * @param {String} data.type - type of the integration
     * @param {String} data.id - Id of the integration
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    createGuildIntegration(guildId: string, data: {
        type: string;
        id: string;
    }): Promise<void>;
    /**
     * Update behaviour and settings of an [integration object](https://discordapp.com/developers/docs/resources/guild#integration-object)
     * @param {String} guildId - Id of the guild
     * @param {String} integrationId - Id of the integration
     * @param {Object} data - Data with the properties listed below
     * @param {Number} data.expire_behaviour - Behaviour when a integration subscription expires
     * @param {Number} data.expire_grace_period - Time in seconds for how long to ignore expired subscriptions
     * @param {Boolean} data.enable_emoticons - If emoticons should be synced for this integration (twitch only atm)
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    updateGuildIntegration(guildId: string, integrationId: string, data: {
        expire_behaviour: number;
        expire_grace_period: number;
        enable_emoticons: boolean;
    }): Promise<void>;
    /**
     * Delete a guild integratiom
     * @param {String} guildId - Id of the guild
     * @param {String} integrationId - Id of the integration
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    removeGuildIntegration(guildId: string, integrationId: string): Promise<void>;
    /**
     * Synchronize a guild integration
     * @param {String} guildId - Id of the guild
     * @param {String} integrationId - Id of the integration
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    syncGuildIntegration(guildId: string, integrationId: string): Promise<void>;
    /**
     * Get the guild embed object
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Object>} [Guild Embed](https://discordapp.com/developers/docs/resources/guild#guild-embed-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    getGuildEmbed(guildId: string): Promise<TGuildEmbed>;
    /**
     * Update a guild embed object
     * @param {String} guildId - Id of the guild
     * @param {Object} data - data
     * @param {Boolean} data.enabled - if the embed is enabled
     * @param {String} data.channel_id - channel Id of the embed
     * @returns {Promise.<Object>} - [Guild Embed](https://discordapp.com/developers/docs/resources/guild#guild-embed-object)
     *
     * | Permissions needed | condition |
     |--------------------|----------:|
     | MANAGE_GUILD       |    always |
     */
    updateGuildEmbed(guildId: string, data: {
        enabled: boolean;
        channel_id: string;
    }): Promise<TGuildEmbed>;
}
/**
 * @typedef {Object} Guild
 * @property {String} id - guild Id
 * @property {String} name - guild name
 * @property {String} icon - icon hash
 * @property {String} splash - splash image hash
 * @property {String} owner_id - Id of the owner
 * @property {String} region - Id of the voice region
 * @property {String} afk_channel_id - Id of the afk channel
 * @property {Number} afk_timeout - afk timeout in seconds
 * @property {Boolean} embed_enabled - if the guild is embeddable
 * @property {String} embed_channel_id - Id of embedded channel
 * @property {Number} verification level - [verification level](https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level) of the guild
 * @property {Number} default_message_notifications - default
 * [notification level](https://discordapp.com/developers/docs/resources/guild#guild-object-default-message-notification-level) of the guild
 * @property {Number} explicit_content_filter - default [filter level](https://discordapp.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level)
 * @property {Role[]} roles - Array of roles
 * @property {Emoji[]} emojis - Array of emojis
 * @property {String[]} features - Array of enabled guild features
 * @property {Number} mfa_level - required [mfa level](https://discordapp.com/developers/docs/resources/guild#guild-object-mfa-level) for the guild
 * @property {String} [application_id] - application Id of the guild creator, if the guild was created by a bot
 * @property {Boolean} widget_enabled - if the server widget is enabled
 * @property {String} widget_channel_id - channel Id of the server widget
 */
/**
 * @typedef {Object} Role
 * @property {String} id - role Id
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
export default GuildMethods;
//# sourceMappingURL=Guilds.d.ts.map