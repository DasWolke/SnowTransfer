import { Ratelimiter, RequestHandler } from "./RequestHandler";
import AssetsMethods = require("./methods/Assets");
import AuditLogMethods = require("./methods/AuditLog");
import AutoModerationMethods = require("./methods/AutoModeration");
import BotMethods = require("./methods/Bot");
import ChannelMethods = require("./methods/Channel");
import EntitlementMethods = require("./methods/Entitlements");
import GuildMethods = require("./methods/Guild");
import GuildScheduledEventMethods = require("./methods/GuildScheduledEvent");
import GuildTemplateMethods = require("./methods/GuildTemplate");
import InteractionMethods = require("./methods/Interaction");
import InviteMethods = require("./methods/Invite");
import SkuMethods = require("./methods/Sku");
import StageInstanceMethods = require("./methods/StageInstance");
import UserMethods = require("./methods/User");
import VoiceMethods = require("./methods/Voice");
import WebhookMethods = require("./methods/Webhook");
import Endpoints = require("./Endpoints");
import Constants = require("./Constants");

import type { APIAllowedMentions } from 'discord-api-types/v10';

namespace SnowTransfer {
	export type Options = {
		/** The URL to start requests from. eg: https://discord.com */
		baseHost: string;
		/** The default allowed_mentions object to send when creating/updating messages */
		allowed_mentions: APIAllowedMentions | undefined;
		/** If methods that send messages should have their content processed to remove [at]everyone and [at]here
		 * @deprecated Use {@link Options.allowed_mentions allowed_mentions} instead */
		disableEveryone: boolean;
		/** If rate limit buckets should be totally bypassed and functions are executed as fast as possible. Only use if you are 100% certain you wont run into issues or if you are proxying */
		bypassBuckets: boolean;
		/** If failed requests that can be retried should be retried, up to retryLimit times. */
		retryRequests: boolean;
		/** How many times requests should be retried if they fail and can be retried. */
		retryLimit: number;
	};
}

/**
 * @since 0.1.0
 */
class SnowTransfer {
	/** Options for this SnowTransfer instance */
	public options: SnowTransfer.Options;
	/** The access token to use for requests. Can be a bot or bearer token */
	public token: string | undefined;
	/** Methods related to channels */
	public channel: ChannelMethods;
	/** Helper to execute REST calls */
	public requestHandler: RequestHandler;
	/** Methods related to users */
	public user: UserMethods;
	/** Methods related to stickers and emojis */
	public assets: AssetsMethods;
	/** Methods related to webhooks */
	public webhook: WebhookMethods;
	/** Methods related to guilds */
	public guild: GuildMethods;
	/** Methods related to guild scheduled events */
	public guildScheduledEvent: GuildScheduledEventMethods;
	/** Methods related to guild templates */
	public guildTemplate: GuildTemplateMethods;
	/** Methods related to application commands/interactions */
	public interaction: InteractionMethods;
	/** Methods related to invites */
	public invite: InviteMethods;
	/** Methods related to voice regions */
	public voice: VoiceMethods;
	/** Methods related to getting gateway connect info */
	public bot: BotMethods;
	/** Methods related to guild audit logs */
	public auditLog: AuditLogMethods;
	/** Methods related to guild stage instances */
	public stageInstance: StageInstanceMethods;
	/** Methods related to guild auto mod */
	public autoMod: AutoModerationMethods;
	/** Methods related to entitlements */
	public entitlement: EntitlementMethods;
	/** Methods related to SKUs */
	public sku: SkuMethods;
	/** Ratelimiter used for handling the ratelimits imposed by the rest api */
	public ratelimiter: Ratelimiter;

	/**
	 * Create a new Rest Client
	 * @param token Discord Bot token to use
	 * @param options options
	 */
	public constructor(token?: string, options?: Partial<SnowTransfer.Options>) {
		if (typeof token === "string" && token === "") throw new Error("Missing token");
		if (token && (!token.startsWith("Bot") && !token.startsWith("Bearer"))) token = `Bot ${token}`;
		this.options = { baseHost: Endpoints.BASE_HOST, allowed_mentions: undefined, disableEveryone: false, bypassBuckets: false, retryRequests: false, retryLimit: Constants.DEFAULT_RETRY_LIMIT, ...options };
		this.token = token;
		this.ratelimiter = new Ratelimiter();
		this.requestHandler = new RequestHandler(this.ratelimiter, {
			token: this.token,
			baseHost: this.options.baseHost,
			bypassBuckets: this.options.bypassBuckets,
			retryFailed: this.options.retryRequests,
			retryLimit: this.options.retryLimit
		});
		this.channel = new ChannelMethods(this.requestHandler, this.options);
		this.user = new UserMethods(this.requestHandler);
		this.assets = new AssetsMethods(this.requestHandler);
		this.webhook = new WebhookMethods(this.requestHandler, this.options);
		this.guild = new GuildMethods(this.requestHandler);
		this.guildScheduledEvent = new GuildScheduledEventMethods(this.requestHandler);
		this.guildTemplate = new GuildTemplateMethods(this.requestHandler);
		this.interaction = new InteractionMethods(this.requestHandler, this.webhook, this.options);
		this.invite = new InviteMethods(this.requestHandler);
		this.voice = new VoiceMethods(this.requestHandler);
		this.bot = new BotMethods(this.requestHandler);
		this.auditLog = new AuditLogMethods(this.requestHandler);
		this.stageInstance = new StageInstanceMethods(this.requestHandler);
		this.autoMod = new AutoModerationMethods(this.requestHandler);
		this.entitlement = new EntitlementMethods(this.requestHandler);
		this.sku = new SkuMethods(this.requestHandler);
	}
}

export = SnowTransfer;
