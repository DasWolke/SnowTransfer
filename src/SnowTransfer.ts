import { Ratelimiter, RequestHandler } from "./RequestHandler";
import AuditLogMethods = require("./methods/AuditLog");
import AutoModerationMethods = require("./methods/AutoModeration");
import BotMethods = require("./methods/Bots");
import ChannelMethods = require("./methods/Channels");
import GuildAssetsMethods = require("./methods/GuildAssets");
import GuildMethods = require("./methods/Guilds");
import GuildScheduledEventMethods = require("./methods/GuildScheduledEvent");
import GuildTemplateMethods = require("./methods/GuildTemplate");
import InteractionMethods = require("./methods/Interactions");
import InviteMethods = require("./methods/Invites");
import StageInstanceMethods = require("./methods/StageInstance");
import UserMethods = require("./methods/Users");
import VoiceMethods = require("./methods/Voice");
import WebhookMethods = require("./methods/Webhooks");
import Endpoints = require("./Endpoints");

class SnowTransfer {
	public options: { baseHost: string; disableEveryone: boolean; };
	public token: string | undefined;
	public channel: ChannelMethods;
	public requestHandler: RequestHandler;
	public user: UserMethods;
	public guildAssets: GuildAssetsMethods;
	public webhook: WebhookMethods;
	public guild: GuildMethods;
	public guildScheduledEvent: GuildScheduledEventMethods;
	public guildTemplate: GuildTemplateMethods;
	public interaction: InteractionMethods;
	public invite: InviteMethods;
	public voice: VoiceMethods;
	public bot: BotMethods;
	public auditLog: AuditLogMethods;
	public stageInstance: StageInstanceMethods;
	public autoMod: AutoModerationMethods;
	public ratelimiter: Ratelimiter;

	/**
	 * Create a new Rest Client
	 * @param token Discord Bot token to use
	 * @param options options
	 */
	public constructor(token?: string, options?: { baseHost?: string; disableEveryone?: boolean; }) {
		if (typeof token === "string" && token === "") throw new Error("Missing token");
		if (token && (!token.startsWith("Bot") && !token.startsWith("Bearer"))) token = `Bot ${token}`;
		this.options = { baseHost: Endpoints.BASE_HOST, disableEveryone: false };
		this.token = token;
		Object.assign(this.options, options);
		this.ratelimiter = new Ratelimiter();
		this.requestHandler = new RequestHandler(this.ratelimiter, { token: this.token, baseHost: this.options.baseHost || Endpoints.BASE_HOST });
		this.channel = new ChannelMethods(this.requestHandler, this.options.disableEveryone);
		this.user = new UserMethods(this.requestHandler);
		this.guildAssets = new GuildAssetsMethods(this.requestHandler);
		this.webhook = new WebhookMethods(this.requestHandler, this.options.disableEveryone);
		this.guild = new GuildMethods(this.requestHandler);
		this.guildScheduledEvent = new GuildScheduledEventMethods(this.requestHandler);
		this.guildTemplate = new GuildTemplateMethods(this.requestHandler);
		this.interaction = new InteractionMethods(this.requestHandler, this.webhook);
		this.invite = new InviteMethods(this.requestHandler);
		this.voice = new VoiceMethods(this.requestHandler);
		this.bot = new BotMethods(this.requestHandler);
		this.auditLog = new AuditLogMethods(this.requestHandler);
		this.stageInstance = new StageInstanceMethods(this.requestHandler);
		this.autoMod = new AutoModerationMethods(this.requestHandler);
	}
}

export = SnowTransfer;
