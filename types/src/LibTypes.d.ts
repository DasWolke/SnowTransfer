/// <reference types="node" />
export declare type TAuditLogEvents = 1 | 10 | 11 | 12 | 13 | 14 | 15 | 20 | 21 | 22 | 23 | 24 | 25 | 30 | 31 | 32 | 40 | 41 | 42 | 50 | 51 | 52 | 60 | 61 | 62 | 72;
export interface TGuild {
    id: string;
    name: string;
    icon: string | null;
    splash: string | null;
    owner?: boolean;
    owner_id: string;
    permissions?: number;
    region: string;
    afk_channel_id: string;
    afk_timeout: number | null;
    embed_enabled?: boolean;
    embed_channel_id?: string;
    verification: 0 | 1 | 2 | 3 | 4;
    default_message_notifications: 0 | 1;
    explicit_content_filter: 0 | 1 | 2;
    roles: TRole[];
    emojis: TEmoji[];
    features: string[];
    mfa_level: 0 | 1;
    application_id?: string | null;
    widget_enabled?: boolean;
    widget_channel_id?: string;
    system_channel_id: string | null;
    max_presences: number | null;
    max_members: number;
    vanity_url_code: string | null;
    description: string | null;
    banner: string | null;
    premium_tier: 0 | 1 | 2 | 3;
    premium_subscription_count?: number;
}
export interface DisocrdRateLimitHeaders {
    "X-RateLimit-Limit": number;
    "X-RateLimit-Remaining": number;
    "X-RateLimit-Reset": number;
    "X-RateLimit-Bucket": string;
    "Retry-After"?: number;
    "X-RateLimit-Global"?: boolean;
}
export interface TEmoji {
    id: string | null;
    name: string;
    roles?: TRole[];
    user?: TUser;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
}
/**
 * Represents a guild or DM channel within Discord.
 */
export interface TChannel {
    id: string;
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    guild_id?: string;
    position?: number;
    permission_overwrites: TPermissionOverwrite[];
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: string | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: TUser[];
    icon?: string | null;
    owner_id?: string;
    application_id?: string;
    parent_id?: string | null;
    last_pin_timestamp?: string;
}
export interface TGuildMember {
    user: TUser;
    nick?: string;
    roles: Array<string>;
    joined_at: string;
    premium_since: string | null;
    deaf: boolean;
    mute: boolean;
}
export interface TBan {
    reason: string | null;
    user: TUser;
}
export interface TUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: 1 | 2;
}
export declare type TRole = {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: number;
    managed: boolean;
    mentionable: boolean;
};
export interface TPermissionOverwrite {
    allow: number;
    deny: number;
    type: string;
}
export interface TAuditLogChange {
    new_value: string | number | boolean | TRole[] | TPermissionOverwrite[];
    old_value: string | number | boolean | TRole[] | TPermissionOverwrite[];
    key: string;
}
export interface TAuditLogEntry {
    target_id: string;
    changes: TAuditLogChange;
    user_id: string;
    id: string;
    action_type: number;
    options: {
        delete_member_days: string;
        members_removed: string;
        channel_id: string;
        count: string;
        id: string;
        type: string;
        role_name: string;
    };
    reason: string;
}
export interface TAuditLogObject {
    webhooks: TWebhook[];
    users: TUser[];
    audit_log_entries: TAuditLogEntry[];
}
export interface TGatewayData {
    url: string;
    shards: number;
    session_start_limit: {
        total: number;
        remaining: number;
        reset_after: number;
    };
}
export interface TGuildEmbed {
    enabled: boolean;
    channel_id: string | null;
}
export interface TInvite {
    code: string;
    guild?: TGuild;
    channel: TChannel;
    uses?: number;
    max_uses?: number;
    max_age?: number;
    temporary?: boolean;
    created_at?: Date;
    revoked?: boolean;
}
export interface TVoiceRegion {
    id: string;
    name: string;
    vip: boolean;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
}
export interface TSelfUser {
    bot: boolean;
    mfa_enabled: boolean;
    verified: boolean;
    email: string;
}
export interface TWebhook {
    id: string;
    guild_id?: string;
    channel_id: string;
    user?: TUser;
    name: string | null;
    avatar: string | null;
    token: string;
}
export interface TMessage {
    id: string;
    channel_id: string;
    guild_id?: string;
    author: TUser | string;
    member?: TGuildMember;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: any;
    mention_roles: string[];
    attachments: {
        id: string;
        filename: string;
        size: string;
        url: string;
        proxy_url: string;
        height: number | null;
        width: number | null;
    }[];
    embeds: TEmbed[];
    reactions?: {
        count: number;
        me: boolean;
        emoji: TEmoji;
    }[];
    nonce?: string | null;
    pinned: boolean;
    webhook_id?: string;
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    activity?: {
        type: 1 | 2 | 3 | 5;
        party_id?: string;
    };
    application?: {
        id: string;
        cover_image?: string;
        description: string;
        icon: string | null;
        name: string;
    };
}
export declare type TEmbed = {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    image?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    thumbnail?: {
        url?: string;
        proxy_url?: string;
        height?: number;
        width?: number;
    };
    video?: {
        url: string;
        height?: number;
        width?: number;
    };
    provider?: {
        name: string;
        url?: string;
    };
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
        proxy_icon_url?: string;
    };
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
};
export declare type PartialInputMessage = {
    content?: string;
    tts?: boolean;
    embed?: TEmbed;
    file?: {
        name?: string;
        file: Buffer;
    };
};
//# sourceMappingURL=LibTypes.d.ts.map