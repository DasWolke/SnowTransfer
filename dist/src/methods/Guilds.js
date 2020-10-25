"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class GuildMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    async createGuild(data) {
        return this.requestHandler.request(Endpoints_1.default.GUILDS, "post", "json", data);
    }
    async getGuild(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD(guildId), "get", "json");
    }
    async updateGuild(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD(guildId), "patch", "json", data);
    }
    async deleteGuild(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD(guildId), "delete", "json");
    }
    async getGuildChannels(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_CHANNELS(guildId), "get", "json");
    }
    async createGuildChannel(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_CHANNELS(guildId), "post", "json", data);
    }
    async updateChannelPositions(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_CHANNELS(guildId), "patch", "json", data);
    }
    async getGuildMember(guildId, memberId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER(guildId, memberId), "get", "json");
    }
    async getGuildMembers(guildId, data = {}) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBERS(guildId), "get", "json", data);
    }
    async addGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER(guildId, memberId), "put", "json", data);
    }
    async updateGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER(guildId, memberId), "patch", "json", data);
    }
    async updateSelf(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER_NICK(guildId, "@me"), "patch", "json", data);
    }
    async addGuildMemberRole(guildId, memberId, roleId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "put", "json", data);
    }
    async removeGuildMemberRole(guildId, memberId, roleId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER_ROLE(guildId, memberId, roleId), "delete", "json", data);
    }
    async removeGuildMember(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_MEMBER(guildId, memberId), "delete", "json", data);
    }
    async getGuildBans(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_BANS(guildId), "get", "json");
    }
    async createGuildBan(guildId, memberId, data) {
        let newData;
        if (data) {
            if (data.reason)
                Object.assign(newData, { queryReason: data.reason });
            if (data.delete_message_days)
                Object.assign(newData, { "delete-message-days": data.delete_message_days });
        }
        return this.requestHandler.request(Endpoints_1.default.GUILD_BAN(guildId, memberId), "put", "json", newData);
    }
    async removeGuildBan(guildId, memberId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_BAN(guildId, memberId), "delete", "json", data);
    }
    async getGuildRoles(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_ROLES(guildId), "get", "json");
    }
    async createGuildRole(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_ROLES(guildId), "post", "json", data);
    }
    async updateGuildRolePositions(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_ROLES(guildId), "put", "json", data);
    }
    async updateGuildRole(guildId, roleId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_ROLE(guildId, roleId), "patch", "json", data);
    }
    async removeGuildRole(guildId, roleId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_ROLE(guildId, roleId), "delete", "json");
    }
    async getGuildPruneCount(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_PRUNE(guildId), "get", "json", data);
    }
    async startGuildPrune(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_PRUNE(guildId), "post", "json", data);
    }
    async getGuildVoiceRegions(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_VOICE_REGIONS(guildId), "get", "json");
    }
    async getGuildInvites(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INVITES(guildId), "get", "json");
    }
    async getGuildIntegrations(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INTEGRATIONS(guildId), "get", "json");
    }
    async createGuildIntegration(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INTEGRATIONS(guildId), "post", "json", data);
    }
    async updateGuildIntegration(guildId, integrationId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INTEGRATION(guildId, integrationId), "patch", "json", data);
    }
    async removeGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
    }
    async syncGuildIntegration(guildId, integrationId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_INTEGRATION(guildId, integrationId), "delete", "json");
    }
    async getGuildEmbed(guildId) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMBED(guildId), "get", "json");
    }
    async updateGuildEmbed(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_EMBED(guildId), "patch", "json", data);
    }
}
module.exports = GuildMethods;
