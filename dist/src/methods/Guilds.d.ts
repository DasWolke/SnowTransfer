declare class GuildMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    createGuild(data: CreateGuildData): Promise<import("@amanda/discordtypings").GuildData>;
    getGuild(guildId: string): Promise<import("@amanda/discordtypings").GuildData>;
    updateGuild(guildId: string, data: UpdateGuildData): Promise<import("@amanda/discordtypings").GuildData>;
    deleteGuild(guildId: string): Promise<void>;
    getGuildChannels(guildId: string): Promise<Array<import("@amanda/discordtypings").GuildChannelData>>;
    createGuildChannel(guildId: string, data: CreateGuildChannelData): Promise<import("@amanda/discordtypings").GuildChannelData>;
    updateChannelPositions(guildId: string, data: Array<{
        id: string;
        position: number;
    }>): Promise<void>;
    getGuildMember(guildId: string, memberId: string): Promise<import("@amanda/discordtypings").MemberData>;
    getGuildMembers(guildId: string, data?: GetGuildMembersData): Promise<Array<import("@amanda/discordtypings").MemberData>>;
    addGuildMember(guildId: string, memberId: string, data: AddGuildMemberData): Promise<import("@amanda/discordtypings").MemberData>;
    updateGuildMember(guildId: string, memberId: string, data: UpdateGuildMemberData): Promise<void>;
    updateSelf(guildId: string, data: {
        nick: string;
    }): Promise<void>;
    addGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: {
        reason?: string;
    }): Promise<void>;
    removeGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: {
        reason?: string;
    }): Promise<void>;
    removeGuildMember(guildId: string, memberId: string, data?: {
        reason?: string;
    }): Promise<void>;
    getGuildBans(guildId: string): Promise<Array<any>>;
    createGuildBan(guildId: string, memberId: string, data?: {
        reason?: string;
        delete_message_days?: number;
    }): Promise<void>;
    removeGuildBan(guildId: string, memberId: string, data?: {
        reason?: string;
    }): Promise<void>;
    getGuildRoles(guildId: string): Promise<Array<import("@amanda/discordtypings").RoleData>>;
    createGuildRole(guildId: string, data?: RoleOptions): Promise<import("@amanda/discordtypings").RoleData>;
    updateGuildRolePositions(guildId: string, data: Array<{
        id: string;
        position: number;
    }>): Promise<Array<import("@amanda/discordtypings").RoleData>>;
    updateGuildRole(guildId: string, roleId: string, data: RoleOptions): Promise<import("@amanda/discordtypings").RoleData>;
    removeGuildRole(guildId: string, roleId: string): Promise<void>;
    getGuildPruneCount(guildId: string, data: {
        days: number;
    }): Promise<{
        pruned: number;
    }>;
    startGuildPrune(guildId: string, data: {
        days: number;
    }): Promise<{
        pruned: number;
    }>;
    getGuildVoiceRegions(guildId: string): Promise<Array<any>>;
    getGuildInvites(guildId: string): Promise<Array<any>>;
    getGuildIntegrations(guildId: string): Promise<Array<any>>;
    createGuildIntegration(guildId: string, data: {
        type: string;
        id: string;
    }): Promise<void>;
    updateGuildIntegration(guildId: string, integrationId: string, data: {
        expire_behavior: number;
        expire_grace_period: number;
        enable_emoticons: boolean;
    }): Promise<void>;
    removeGuildIntegration(guildId: string, integrationId: string): Promise<void>;
    syncGuildIntegration(guildId: string, integrationId: string): Promise<void>;
    getGuildEmbed(guildId: string): Promise<any>;
    updateGuildEmbed(guildId: string, data: {
        enabled: boolean;
        channel_id: string;
    }): Promise<any>;
}
interface CreateGuildData {
    name: string;
    region?: string;
    icon?: string;
    verification_level?: number;
    default_message_notifications?: number;
    channels?: Array<import("@amanda/discordtypings").ChannelData>;
    roles?: Array<import("@amanda/discordtypings").RoleData>;
}
interface UpdateGuildData {
    name?: string;
    region?: string;
    verification_level?: number;
    default_message_notifications?: number;
    afk_channel_id?: string;
    afk_timeout?: number;
    icon?: string;
    owner_id?: string;
    splash?: string;
}
interface CreateGuildChannelData {
    name: string;
    type?: number;
    bitrate?: number;
    user_limit?: number;
    permission_overwrites?: Array<any>;
}
interface AddGuildMemberData {
    access_token: string;
    nick?: string;
    roles?: Array<string>;
    mute?: boolean;
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
export = GuildMethods;
