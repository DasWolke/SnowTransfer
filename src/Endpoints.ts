'use strict';

/**
 * Mostly taken from https://github.com/abalabahaha/eris/blob/master/lib/rest/Endpoints.js
 *
 * Removed User-only endpoints
 * @private
 */

import Constants from "./Constants";

export default {
  BASE_URL : '/api/v' + Constants.REST_API_VERSION,
  BASE_HOST : 'https://discordapp.com',
  CDN_URL : 'https://cdn.discordapp.com',
  
  CHANNEL : (chanID: string) => `/channels/${chanID}`,
  CHANNEL_BULK_DELETE : (chanID : string) => `/channels/${chanID}/messages/bulk-delete`,
  CHANNEL_INVITES : (chanID :string) => `/channels/${chanID}/invites`,
  CHANNEL_MESSAGE_REACTION : (chanID: string, msgID :string, reaction: string) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}`,
  CHANNEL_MESSAGE_REACTION_USER : (chanID: string, msgID: string, reaction: string, userID: string) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}/${userID}`,
  CHANNEL_MESSAGE_REACTIONS : (chanID: string, msgID: string) => `/channels/${chanID}/messages/${msgID}/reactions`,
  CHANNEL_MESSAGE : (chanID: string, msgID: string) => `/channels/${chanID}/messages/${msgID}`,
  CHANNEL_MESSAGES : (chanID :string) => `/channels/${chanID}/messages`,
  CHANNEL_PERMISSION : (chanID: string, overID: string) => `/channels/${chanID}/permissions/${overID}`,
  CHANNEL_PERMISSIONS : (chanID: string) => `/channels/${chanID}/permissions`,
  CHANNEL_PIN : (chanID: string, msgID: string) => `/channels/${chanID}/pins/${msgID}`,
  CHANNEL_PINS : (chanID: string) => `/channels/${chanID}/pins`,
  CHANNEL_RECIPIENT : (groupID: string, userID: string) => `/channels/${groupID}/recipients/${userID}`,
  CHANNEL_TYPING : (chanID: string) => `/channels/${chanID}/typing`,
  CHANNEL_WEBHOOKS : (chanID: string) => `/channels/${chanID}/webhooks`,
  CHANNELS : '/channels',
  GATEWAY : '/gateway',
  GATEWAY_BOT : '/gateway/bot',
  GUILD : (guildID: string) => `/guilds/${guildID}`,
  GUILD_AUDIT_LOGS : (guildID: string) => `/guilds/${guildID}/audit-logs`,
  GUILD_BAN : (guildID: string, memberID: string) => `/guilds/${guildID}/bans/${memberID}`,
  GUILD_BANS : (guildID: string) => `/guilds/${guildID}/bans`,
  GUILD_CHANNELS : (guildID: string) => `/guilds/${guildID}/channels`,
  GUILD_EMBED : (guildID: string) => `/guilds/${guildID}/embed`,
  GUILD_EMOJI : (guildID: string, emojiID: string) => `/guilds/${guildID}/emojis/${emojiID}`,
  GUILD_EMOJIS : (guildID: string) => `/guilds/${guildID}/emojis`,
  GUILD_INVITES : (guildID: string) => `/guilds/${guildID}/invites`,
  GUILD_INTEGRATION : (guildID: string, integrationID: string) => `/guilds/${guildID}/integrations/${integrationID}`,
  GUILD_INTEGRATIONS : (guildID: string) => `/guilds/${guildID}/integrations`,
  GUILD_MEMBER : (guildID: string, memberID: string) => `/guilds/${guildID}/members/${memberID}`,
  GUILD_MEMBER_NICK : (guildID: string, memberID: string) => `/guilds/${guildID}/members/${memberID}/nick`,
  GUILD_MEMBER_ROLE : (guildID: string, memberID: string, roleID: string) => `/guilds/${guildID}/members/${memberID}/roles/${roleID}`,
  GUILD_MEMBERS : (guildID: string) => `/guilds/${guildID}/members`,
  GUILD_PRUNE : (guildID: string) => `/guilds/${guildID}/prune`,
  GUILD_ROLE : (guildID: string, roleID: string) => `/guilds/${guildID}/roles/${roleID}`,
  GUILD_ROLES : (guildID: string) => `/guilds/${guildID}/roles`,
  GUILD_VOICE_REGIONS : (guildID: string) => `/guilds/${guildID}/regions`,
  GUILD_WEBHOOKS : (guildID: string) => `/guilds/${guildID}/webhooks`,
  GUILDS : '/guilds',
  INVITE : (inviteID: string) => `/invite/${inviteID}`,
  OAUTH2_APPLICATION : (appID: string) => `/oauth2/applications/${appID}`,
  USER : (userID: string) => `/users/${userID}`,
  USER_CHANNELS : (userID :String) => `/users/${userID}/channels`,
  USER_GUILD : (userID: string, guildID: string) => `/users/${userID}/guilds/${guildID}`,
  USER_GUILDS : (userID: string) => `/users/${userID}/guilds`,
  USERS : '/users',
  VOICE_REGIONS : '/voice/regions',
  WEBHOOK : (hookID: string) => `/webhooks/${hookID}`,
  WEBHOOK_SLACK : (hookID: string) => `/webhooks/${hookID}/slack`,
  WEBHOOK_TOKEN : (hookID: string, token: string) => `/webhooks/${hookID}/${token}`,
  WEBHOOK_TOKEN_SLACK : (hookID: string, token: string) => `/webhooks/${hookID}/${token}/slack`,
}
