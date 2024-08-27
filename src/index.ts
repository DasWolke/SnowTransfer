import AuditLogMethods2 = require("./methods/AuditLog");
import AutoModerationMethods2 = require("./methods/AutoModeration");
import BotMethods2 = require("./methods/Bots");
import ChannelMethods2 = require("./methods/Channels");
import GuildAssetsMethods2 = require("./methods/GuildAssets");
import GuildMethods2 = require("./methods/Guilds");
import GuildScheduledEventMethods2 = require("./methods/GuildScheduledEvent");
import GuildTemplateMethods2 = require("./methods/GuildTemplate");
import InteractionMethods2 = require("./methods/Interactions");
import InviteMethods2 = require("./methods/Invites");
import StageInstanceMethods2 = require("./methods/StageInstance");
import UserMethods2 = require("./methods/Users");
import VoiceMethods2 = require("./methods/Voice");
import WebhookMethods2 = require("./methods/Webhooks");

import Constants2 = require("./Constants");
import Endpoints2 = require("./Endpoints");
import SnowTransfer2 = require("./SnowTransfer");
import {
	Ratelimiter as Ratelimiter2,
	LocalBucket as LocalBucket2,
	GlobalBucket as GlobalBucket2,
	RequestHandler as RequestHandler2,
	type HTTPMethod,
	type HandlerEvents,
	type RESTPostAPIAttachmentsRefreshURLsResult,
	DiscordAPIError as DiscordAPIError2
} from "./RequestHandler";

export {
	AuditLogMethods2 as AuditLogMethods,
	AutoModerationMethods2 as AutoModerationMethods,
	BotMethods2 as BotMethods,
	ChannelMethods2 as ChannelMethods,
	GuildAssetsMethods2 as GuildAssetsMethods,
	GuildMethods2 as GuildMethods,
	GuildScheduledEventMethods2 as GuildScheduledEventMethods,
	GuildTemplateMethods2 as GuildTemplateMethods,
	InteractionMethods2 as InteractionMethods,
	InviteMethods2 as InviteMethods,
	StageInstanceMethods2 as StageInstanceMethods,
	UserMethods2 as UserMethods,
	VoiceMethods2 as VoiceMethods,
	WebhookMethods2 as WebhookMethods,

	Constants2 as Constants,
	Endpoints2 as Endpoints,
	SnowTransfer2 as SnowTransfer,
	Ratelimiter2 as Ratelimiter,
	LocalBucket2 as LocalBucket,
	GlobalBucket2 as GlobalBucket,
	RequestHandler2 as RequestHandler,
	DiscordAPIError2 as DiscordAPIError,

	type HTTPMethod,
	type HandlerEvents,
	type RESTPostAPIAttachmentsRefreshURLsResult
};
