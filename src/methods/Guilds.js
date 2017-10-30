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

    async getGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'get', 'json');
    }

    async updateGuild(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'patch', 'json', data);
    }

    async deleteGuild(guildId) {
        return this.requestHandler.request(Endpoints.GUILD(guildId), 'delete', 'json');
    }

    async getGuildChannels(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'get', 'json');
    }

    async createGuildChannel(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'post', 'json', data);
    }

    async updateChannelPositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_CHANNELS(guildId), 'patch', 'json', data);
    }

    async getGuildMember(guildId, memberId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'get', 'json');
    }

    async getGuildMembers(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBERS(guildId), 'get', 'json');
    }

    async addGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'put', 'json', data);
    }

    async updateGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'patch', 'json', data);
    }

    async updateSelf(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_NICK(guildId, '@me'), 'patch', 'json', data);
    }

    async addGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'put', 'json');
    }

    async removeGuildMemberRole(guildId, memberId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), 'delete', 'json');
    }

    async removeGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_MEMBER(guildId, memberId), 'delete', 'json', data);
    }

    async getGuildBans(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_BANS(guildId), 'get', 'json');
    }

    async createGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'put', 'json', data);
    }

    async removeGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints.GUILD_BAN(guildId, memberId), 'delete', 'json', data);
    }

    async getGuildRoles(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'get', 'json');
    }

    async createGuildRole(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'post', 'json', data);
    }

    async updateGuildRolePositions(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLES(guildId), 'put', 'json', data);
    }

    async updateGuildRole(guildId, roleId, data) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'patch', 'json', data);
    }

    async removeGuildRole(guildId, roleId) {
        return this.requestHandler.request(Endpoints.GUILD_ROLE(guildId, roleId), 'delete', 'json');
    }

    async getGuildPruneCount(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'get', 'json', data);
    }

    async startGuildPrune(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_PRUNE(guildId), 'post', 'json', data);
    }

    async getGuildVoiceRegions(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_VOICE_REGIONS(guildId), 'get', 'json');
    }

    async getGuildInvites(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INVITES(guildId), 'get', 'json');
    }

    async getGuildIntegrations(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'get', 'json');
    }

    async createGuildIntegration(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATIONS(guildId), 'post', 'json', data);
    }

    async updateGuildIntegration(guildId, integrationId, data) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'patch', 'json', data);
    }

    async removeGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    async syncGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints.GUILD_INTEGRATION(guildId, integrationId), 'delete', 'json');
    }

    async getGuildEmbed(guildId) {
        return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), 'get', 'json');
    }

    async updateGuildEmbed(guildId, data) {
        return this.requestHandler.request(Endpoints.GUILD_EMBED(guildId), 'patch', 'json', data);
    }

}

module.exports = GuildMethods;