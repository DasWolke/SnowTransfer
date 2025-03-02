"use strict";

import Constants = require("./Constants");

/**
 * Mostly taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/Endpoints.js
 *
 * Removed User-only endpoints
 */
const Endpoints = {
	BASE_URL: "/api/v" + Constants.REST_API_VERSION as `/api/v${typeof Constants.REST_API_VERSION}`,
	BASE_HOST: "https://discord.com" as const,
	CDN_URL: "https://cdn.discordapp.com" as const,

	APPLICATION_COMMAND: (appId: string, cmdId: string) => `${Endpoints.APPLICATION_COMMANDS(appId)}/${cmdId}` as `${ReturnType<typeof Endpoints.APPLICATION_COMMANDS>}/{cmd_id}`,
	APPLICATION_COMMANDS: (appId: string) => `/applications/${appId}/commands` as "/applications/{app_id}/commands",
	APPLICATION_EMOJI: (appId: string, emojiId: string) => `${Endpoints.APPLICATION_EMOJIS(appId)}/${emojiId}` as `${ReturnType<typeof Endpoints.APPLICATION_EMOJIS>}/{emoji_id}`,
	APPLICATION_EMOJIS: (appId: string) => `/applications/${appId}/emojis` as "/applications/{app_id}/emojis",
	APPLICATION_ENTITLEMENT: (appId: string, entitlementId: string) => `${Endpoints.APPLICATION_ENTITLEMENTS(appId)}/${entitlementId}` as `${ReturnType<typeof Endpoints.APPLICATION_ENTITLEMENTS>}/{entitlement_id}`,
	APPLICATION_ENTITLEMENT_CONSUME: (appId: string, entitlementId: string) => `${Endpoints.APPLICATION_ENTITLEMENT(appId, entitlementId)}/consume` as `${ReturnType<typeof Endpoints.APPLICATION_ENTITLEMENT>}/consume`,
	APPLICATION_ENTITLEMENTS: (appId: string) => `/applications/${appId}/entitlements` as "/applications/{app_id}/entitlements",
	APPLICATION_GUILD_COMMANDS_PERMISSIONS: (appId: string, guildId: string) => `${Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId)}/permissions` as `${ReturnType<typeof Endpoints.APPLICATION_GUILD_COMMANDS>}/permissions`,
	APPLICATION_GUILD_COMMAND_PERMISSIONS: (appId: string, guildId: string, cmdId: string) => `${Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId)}/permissions` as `${ReturnType<typeof Endpoints.APPLICATION_GUILD_COMMAND>}/permissions`,
	APPLICATION_GUILD_COMMAND: (appId: string, guildId: string, cmdId: string) => `${Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId)}/${cmdId}` as `${ReturnType<typeof Endpoints.APPLICATION_GUILD_COMMANDS>}/{cmd_id}`,
	APPLICATION_GUILD_COMMANDS: (appId: string, guildId: string) => `/applications/${appId}/guilds/${guildId}/commands` as "/applications/{app_id}/guilds/{guild_id}/commands",
	APPLICATION_SKUS: (appId: string) => `/applications/${appId}/skus` as "/applications/{app_id}/skus",
	ATTACHMENTS_REFRESH_URLS: `/attachments/refresh-urls` as const,
	CHANNEL: (chanId: string) => `${Endpoints.CHANNELS}/${chanId}` as `${typeof Endpoints.CHANNELS}/{channel_id}`,
	CHANNEL_ATTACHMENTS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/attachments` as `${ReturnType<typeof Endpoints.CHANNEL>}/attachments`,
	CHANNEL_BULK_DELETE: (chanId: string) => `${Endpoints.CHANNEL_MESSAGES(chanId)}/bulk-delete` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGES>}/bulk-delete`,
	CHANNEL_FOLLOWERS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/followers` as `${ReturnType<typeof Endpoints.CHANNEL>}/followers`,
	CHANNEL_INVITES: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/invites` as `${ReturnType<typeof Endpoints.CHANNEL>}/invites`,
	CHANNEL_MESSAGE: (chanId: string, msgId: string) => `${Endpoints.CHANNEL_MESSAGES(chanId)}/${msgId}` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGES>}/{message_id}`,
	CHANNEL_MESSAGE_CROSSPOST: (chanId: string, msgId: string) => `${Endpoints.CHANNEL_MESSAGE(chanId, msgId)}/crosspost` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGE>}/crosspost`,
	CHANNEL_MESSAGE_REACTION: (chanId: string, msgId: string, reaction: string) => `${Endpoints.CHANNEL_MESSAGE_REACTIONS(chanId, msgId)}/${reaction}` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGE_REACTIONS>}/{reaction}`,
	CHANNEL_MESSAGE_REACTION_USER: (chanId: string, msgId: string, reaction: string, userId: string) => `${Endpoints.CHANNEL_MESSAGE_REACTION(chanId, msgId, reaction)}/${userId}` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGE_REACTION>}/{user_id}`,
	CHANNEL_MESSAGE_REACTIONS: (chanId: string, msgId: string) => `${Endpoints.CHANNEL_MESSAGE(chanId, msgId)}/reactions` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGE>}/reactions`,
	CHANNEL_MESSAGE_THREADS: (chanId: string, msgId: string) => `${Endpoints.CHANNEL_MESSAGE(chanId, msgId)}/threads` as `${ReturnType<typeof Endpoints.CHANNEL_MESSAGE>}/threads`,
	CHANNEL_MESSAGES: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/messages` as `${ReturnType<typeof Endpoints.CHANNEL>}/messages`,
	CHANNEL_PERMISSION: (chanId: string, permId: string) => `${Endpoints.CHANNEL_PERMISSIONS(chanId)}/${permId}` as `${ReturnType<typeof Endpoints.CHANNEL_PERMISSIONS>}/{perm_id}`,
	CHANNEL_PERMISSIONS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/permissions` as `${ReturnType<typeof Endpoints.CHANNEL>}/permissions`,
	CHANNEL_PIN: (chanId: string, msgId: string) => `${Endpoints.CHANNEL_PINS(chanId)}/${msgId}` as `${ReturnType<typeof Endpoints.CHANNEL_PINS>}/{message_id}`,
	CHANNEL_PINS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/pins` as `${ReturnType<typeof Endpoints.CHANNEL>}/pins`,
	CHANNEL_RECIPIENT: (chanId: string, userId: string) => `${Endpoints.CHANNEL(chanId)}/recipients/${userId}` as `${ReturnType<typeof Endpoints.CHANNEL>}/recipients/{user_id}`,
	CHANNEL_THREADS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/threads` as `${ReturnType<typeof Endpoints.CHANNEL>}/threads`,
	CHANNEL_THREAD_MEMBER: (chanId: string, memberId: string) => `${Endpoints.CHANNEL_THREAD_MEMBERS(chanId)}/${memberId}` as `${ReturnType<typeof Endpoints.CHANNEL_THREAD_MEMBERS>}/{member_id}`,
	CHANNEL_THREAD_MEMBERS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/thread-members` as `${ReturnType<typeof Endpoints.CHANNEL>}/thread-members`,
	CHANNEL_THREADS_ARCHIVED_PRIVATE: (chanId: string) => `${Endpoints.CHANNEL_THREADS(chanId)}/archived/private` as `${ReturnType<typeof Endpoints.CHANNEL_THREADS>}/archived/private`,
	CHANNEL_THREADS_ARCHIVED_PRIVATE_USER: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/users/@me/threads/archived/private` as `${ReturnType<typeof Endpoints.CHANNEL>}/users/@me/threads/archived/private`,
	CHANNEL_THREADS_ARCHIVED_PUBLIC: (chanId: string) => `${Endpoints.CHANNEL_THREADS(chanId)}/archived/public` as `${ReturnType<typeof Endpoints.CHANNEL_THREADS>}/archived/public`,
	CHANNEL_TYPING: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/typing` as `${ReturnType<typeof Endpoints.CHANNEL>}/typing`,
	CHANNEL_WEBHOOKS: (chanId: string) => `${Endpoints.CHANNEL(chanId)}/webhooks` as `${ReturnType<typeof Endpoints.CHANNEL>}/webhooks`,
	CHANNELS: "/channels" as const,
	GATEWAY: "/gateway" as const,
	GATEWAY_BOT: "/gateway/bot" as const,
	GUILD: (guildId: string) => `${Endpoints.GUILDS}/${guildId}` as `${typeof Endpoints.GUILDS}/{guild_id}`,
	GUILD_AUDIT_LOGS: (guildId: string) => `${Endpoints.GUILD(guildId)}/audit-logs` as `${ReturnType<typeof Endpoints.GUILD>}/audit-logs`,
	GUILD_AUTO_MOD_RULE: (guildId: string, ruleId: string) => `${Endpoints.GUILD_AUTO_MOD_RULES(guildId)}/${ruleId}` as `${ReturnType<typeof Endpoints.GUILD_AUTO_MOD_RULES>}/{rule_id}`,
	GUILD_AUTO_MOD_RULES: (guildId: string) => `${Endpoints.GUILD(guildId)}/auto-moderation/rules` as `${ReturnType<typeof Endpoints.GUILD>}/auto-moderation/rules`,
	GUILD_BAN: (guildId: string, memberId: string) => `${Endpoints.GUILD_BANS(guildId)}/${memberId}` as `${ReturnType<typeof Endpoints.GUILD_BANS>}/{member_id}`,
	GUILD_BANS: (guildId: string) => `${Endpoints.GUILD(guildId)}/bans` as `${ReturnType<typeof Endpoints.GUILD>}/bans`,
	GUILD_CHANNELS: (guildId: string) => `${Endpoints.GUILD(guildId)}/channels` as `${ReturnType<typeof Endpoints.GUILD>}/channels`,
	GUILD_EMOJI: (guildId: string, emojiId: string) => `${Endpoints.GUILD_EMOJIS(guildId)}/${emojiId}` as `${ReturnType<typeof Endpoints.GUILD_EMOJIS>}/{emoji_id}`,
	GUILD_EMOJIS: (guildId: string) => `${Endpoints.GUILD(guildId)}/emojis` as `${ReturnType<typeof Endpoints.GUILD>}/emojis`,
	GUILD_INVITES: (guildId: string) => `${Endpoints.GUILD(guildId)}/invites` as `${ReturnType<typeof Endpoints.GUILD>}/invites`,
	GUILD_INTEGRATION: (guildId: string, integrationId: string) => `${Endpoints.GUILD_INTEGRATIONS(guildId)}/${integrationId}` as `${ReturnType<typeof Endpoints.GUILD_INTEGRATIONS>}/{integration_id}`,
	GUILD_INTEGRATIONS: (guildId: string) => `${Endpoints.GUILD(guildId)}/integrations` as `${ReturnType<typeof Endpoints.GUILD>}/integrations`,
	GUILD_MEMBER: (guildId: string, memberId: string) => `${Endpoints.GUILD_MEMBERS(guildId)}/${memberId}` as `${ReturnType<typeof Endpoints.GUILD_MEMBERS>}/{member_id}`,
	GUILD_MEMBER_ROLE: (guildId: string, memberId: string, roleId: string) => `${Endpoints.GUILD_MEMBER(guildId, memberId)}/roles/${roleId}` as `${ReturnType<typeof Endpoints.GUILD_MEMBER>}/roles/{role_id}`,
	GUILD_MEMBERS: (guildId: string) => `${Endpoints.GUILD(guildId)}/members` as `${ReturnType<typeof Endpoints.GUILD>}/members`,
	GUILD_MEMBERS_SEARCH: (guildId: string) => `${Endpoints.GUILD_MEMBERS(guildId)}/search` as `${ReturnType<typeof Endpoints.GUILD_MEMBERS>}/search`,
	GUILD_PREVIEW: (guildId: string) => `${Endpoints.GUILD(guildId)}/preview` as `${ReturnType<typeof Endpoints.GUILD>}/preview`,
	GUILD_PRUNE: (guildId: string) => `${Endpoints.GUILD(guildId)}/prune` as `${ReturnType<typeof Endpoints.GUILD>}/prune`,
	GUILD_ROLE: (guildId: string, roleId: string) => `${Endpoints.GUILD_ROLES(guildId)}/${roleId}` as `${ReturnType<typeof Endpoints.GUILD_ROLES>}/{role_id}`,
	GUILD_ROLES: (guildId: string) => `${Endpoints.GUILD(guildId)}/roles` as `${ReturnType<typeof Endpoints.GUILD>}/roles`,
	GUILD_SCHEDULED_EVENTS: (guildId: string) => `${Endpoints.GUILD(guildId)}/scheduled-events` as `${ReturnType<typeof Endpoints.GUILD>}/scheduled-events`,
	GUILD_SCHEDULED_EVENT: (guildId: string, eventId: string) => `${Endpoints.GUILD_SCHEDULED_EVENTS(guildId)}/${eventId}` as `${ReturnType<typeof Endpoints.GUILD_SCHEDULED_EVENTS>}/{event_id}`,
	GUILD_SCHEDULED_EVENT_USERS: (guildId: string, eventId: string) => `${Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId)}/users` as `${ReturnType<typeof Endpoints.GUILD_SCHEDULED_EVENT>}/users`,
	GUILD_STICKER: (guildId: string, stickerId: string) => `${Endpoints.GUILD_STICKERS(guildId)}/${stickerId}` as `${ReturnType<typeof Endpoints.GUILD_STICKERS>}/{sticker_id}`,
	GUILD_STICKERS: (guildId: string) => `${Endpoints.GUILD(guildId)}/stickers` as `${ReturnType<typeof Endpoints.GUILD>}/stickers`,
	GUILD_TEMPLATE: (guildId: string, code: string) => `${Endpoints.GUILD_TEMPLATES(guildId)}/${code}` as `${ReturnType<typeof Endpoints.GUILD_TEMPLATES>}/{code}`,
	GUILD_THREADS_ACTIVE: (guildId: string) => `${Endpoints.GUILD(guildId)}/threads/active` as `${ReturnType<typeof Endpoints.GUILD>}/threads/active`,
	GUILD_TEMPLATES: (guildId: string) => `${Endpoints.GUILD(guildId)}/templates` as `${ReturnType<typeof Endpoints.GUILD>}/templates`,
	GUILD_VANITY: (guildId: string) => `${Endpoints.GUILD(guildId)}/vanity-url` as `${ReturnType<typeof Endpoints.GUILD>}/vanity-url`,
	GUILD_VOICE_REGIONS: (guildId: string) => `${Endpoints.GUILD(guildId)}/regions` as `${ReturnType<typeof Endpoints.GUILD>}/regions`,
	GUILD_VOICE_STATE_USER: (guildId: string, memberId: string) => `${Endpoints.GUILD(guildId)}/voice-states/${memberId}` as `${ReturnType<typeof Endpoints.GUILD>}/voice-states/{member_id}`,
	GUILD_WEBHOOKS: (guildId: string) => `${Endpoints.GUILD(guildId)}/webhooks` as `${ReturnType<typeof Endpoints.GUILD>}/webhooks`,
	GUILD_WELCOME_SCREEN: (guildId: string) => `${Endpoints.GUILD(guildId)}/welcome-screen` as `${ReturnType<typeof Endpoints.GUILD>}/welcome-screen`,
	GUILD_WIDGET: (guildId: string) => `${Endpoints.GUILD(guildId)}/widget.json` as `${ReturnType<typeof Endpoints.GUILD>}/widget.json`,
	GUILD_WIDGET_SETTINGS: (guildId: string) => `${Endpoints.GUILD(guildId)}/widget` as `${ReturnType<typeof Endpoints.GUILD>}/widget`,
	GUILDS: "/guilds" as const,
	INTERACTION_CALLBACK: (interactionId: string, token: string) => `/interactions/${interactionId}/${token}/callback` as "/interactions/{interaction_id}/{token}/callback",
	INVITES: (inviteId: string) => `/invites/${inviteId}` as "/invites/{invite_id}",
	OAUTH2_APPLICATION: (appId: string) => `/oauth2/applications/${appId}` as "/oauth2/applications/{app_id}",
	OAUTH2_TOKEN: "/api/oauth2/token" as const,
	POLL_ANSWER: (chanId: string, msgId: string, answerId: string) => `${Endpoints.CHANNEL(chanId)}/polls/${msgId}/answers/${answerId}` as `${ReturnType<typeof Endpoints.CHANNEL>}/polls/{message_id}/answers/{answer_id}`,
	POLL_EXPIRE: (chanId: string, msgId: string) => `${Endpoints.CHANNEL(chanId)}/polls/${msgId}/expire` as `${ReturnType<typeof Endpoints.CHANNEL>}/polls/{message_id}/expire`,
	SKU_SUBSCRIPTIONS: (skuId: string) => `/skus/${skuId}/subscriptions` as "/skus/{sku_id}/subscriptions",
	SKU_SUBSCRIPTION: (skuId: string, subscriptionId: string) => `${Endpoints.SKU_SUBSCRIPTIONS(skuId)}/${subscriptionId}` as `${ReturnType<typeof Endpoints.SKU_SUBSCRIPTIONS>}/{subscription_id}`,
	STAGE_INSTANCE_CHANNEL: (chanId: string) => `${Endpoints.STAGE_INSTANCES}/${chanId}` as `${typeof Endpoints.STAGE_INSTANCES}/{channel_id}`,
	STAGE_INSTANCES: "/stage-instances" as const,
	STICKER: (stickerId: string) => `/stickers/${stickerId}` as "/stickers/{sticker_id}",
	TEMPLATE: (code: string) => `/guilds/templates/${code}` as "/guilds/templates/{code}",
	USER: (userId: string) => `${Endpoints.USERS}/${userId}` as `${typeof Endpoints.USERS}/{user_id}`,
	USER_APPLICATION_ROLE_CONNECTION: (userId: string, appId: string) => `${Endpoints.USER(userId)}/applications/${appId}/role-connection` as `${ReturnType<typeof Endpoints.USER>}/applications/{app_id}/role-connection`,
	USER_CHANNELS: (userId: string) => `${Endpoints.USER(userId)}/channels` as `${ReturnType<typeof Endpoints.USER>}/channels`,
	USER_CONNECTIONS: (userId: string) => `${Endpoints.USER(userId)}/connections` as `${ReturnType<typeof Endpoints.USER>}/connections`,
	USER_GUILD: (userId: string, guildId: string) => `${Endpoints.USER_GUILDS(userId)}/${guildId}` as `${ReturnType<typeof Endpoints.USER_GUILDS>}/{guild_id}`,
	USER_GUILDS: (userId: string) => `${Endpoints.USER(userId)}/guilds` as `${ReturnType<typeof Endpoints.USER>}/guilds`,
	USER_GUILD_VOICE_STATE: (guildId: string, userId: string) => `${Endpoints.GUILD(guildId)}/voice-states/${userId}` as `${ReturnType<typeof Endpoints.GUILD>}/voice-states/{user_id}`,
	USERS: "/users" as const,
	VOICE_REGIONS: "/voice/regions" as const,
	WEBHOOK: (hookId: string) => `/webhooks/${hookId}` as "/webhooks/{hook_id}",
	WEBHOOK_TOKEN: (hookId: string, token: string) => `${Endpoints.WEBHOOK(hookId)}/${token}` as `${ReturnType<typeof Endpoints.WEBHOOK>}/{token}`,
	WEBHOOK_TOKEN_GITHUB: (hookId: string, token: string) => `${Endpoints.WEBHOOK_TOKEN(hookId, token)}/github` as `${ReturnType<typeof Endpoints.WEBHOOK_TOKEN>}/github`,
	WEBHOOK_TOKEN_MESSAGE: (hookId: string, token: string, msgId: string) => `/webhooks/${hookId}/${token}/messages/${msgId}` as `${ReturnType<typeof Endpoints.WEBHOOK_TOKEN>}/messages/{message_id}`,
	WEBHOOK_TOKEN_SLACK: (hookId: string, token: string) => `${Endpoints.WEBHOOK_TOKEN(hookId, token)}/slack` as `${ReturnType<typeof Endpoints.WEBHOOK_TOKEN>}/slack`,
};

export = Endpoints;
