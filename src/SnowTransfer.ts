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

import type { SnowTransferOptions } from "./Types";

/**
 * @since 0.1.0
 * @protected
 */
class SnowTransfer {
	/** Options for this SnowTransfer instance */
	public options: SnowTransferOptions;
	/** The access token to use for requests. Can be a bot or bearer token */
	public token: string | undefined;
	/** Methods related to channels */
	public readonly channel: ChannelMethods;
	/** Helper to execute REST calls */
	public readonly requestHandler: RequestHandler;
	/** Methods related to users */
	public readonly user: UserMethods;
	/** Methods related to stickers and emojis */
	public readonly assets: AssetsMethods;
	/** Methods related to webhooks */
	public readonly webhook: WebhookMethods;
	/** Methods related to guilds */
	public readonly guild: GuildMethods;
	/** Methods related to guild scheduled events */
	public readonly guildScheduledEvent: GuildScheduledEventMethods;
	/** Methods related to guild templates */
	public readonly guildTemplate: GuildTemplateMethods;
	/** Methods related to application commands/interactions */
	public readonly interaction: InteractionMethods;
	/** Methods related to invites */
	public readonly invite: InviteMethods;
	/** Methods related to voice regions */
	public readonly voice: VoiceMethods;
	/** Methods related to getting gateway connect info */
	public readonly bot: BotMethods;
	/** Methods related to guild audit logs */
	public readonly auditLog: AuditLogMethods;
	/** Methods related to guild stage instances */
	public readonly stageInstance: StageInstanceMethods;
	/** Methods related to guild auto mod */
	public readonly autoMod: AutoModerationMethods;
	/** Methods related to entitlements */
	public readonly entitlement: EntitlementMethods;
	/** Methods related to SKUs */
	public readonly sku: SkuMethods;
	/** Ratelimiter used for handling the ratelimits imposed by the rest api */
	public readonly ratelimiter: Ratelimiter;

	/**
	 * Create a new Rest Client
	 * @param token Discord Bot token to use
	 * @param options options
	 */
	public constructor(token?: string, options?: Partial<SnowTransferOptions>) {
		if (typeof token === "string" && token === "") throw new Error("Missing token");
		if (token && (!token.startsWith("Bot") && !token.startsWith("Bearer"))) token = `Bot ${token}`;
		this.options = { baseHost: Endpoints.BASE_HOST, allowed_mentions: undefined, bypassBuckets: false, retryRequests: false, retryLimit: Constants.DEFAULT_RETRY_LIMIT, ...options };
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
