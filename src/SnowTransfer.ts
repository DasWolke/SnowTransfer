import Ratelimiter from "./Ratelimiter";
import RequestHandler from "./RequestHandler";
import ChannelMethods from "./methods/Channels";
import UserMethods from "./methods/Users";
import GuildAssetsMethods from "./methods/GuildAssets";
import WebhookMethods from "./methods/Webhooks";
import GuildMethods from "./methods/Guilds";
import GuildScheduledEventMethods from "./methods/GuildScheduledEvent";
import GuildTemplateMethods from "./methods/GuildTemplate";
import InteractionMethods from "./methods/Interactions";
import InviteMethods from "./methods/Invites";
import VoiceMethods from "./methods/Voices";
import BotMethods from "./methods/Bots";
import AuditLogMethods from "./methods/AuditLog";
import StageInstanceMethods from "./methods/StageInstance";
import Endpoints from "./Endpoints";

const { version } = require("../package.json");

class SnowTransfer {
	public options: { baseHost: string; disableEveryone: boolean; sentryOptions: { extra: { snowtransferVersion: string; }; }; useRedis: boolean; };
	public token: string;
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
	public ratelimiter: Ratelimiter;

	/**
	 * Create a new Rest Client
	 * @param token Discord Bot token to use
	 * @param options options
	 */
	public constructor(token: string, options?: { baseHost?: string; disableEveryone?: boolean; }) {
		if (!token || token === "") {
			throw new Error("Missing token");
		}
		if (!token.startsWith("Bot")) {
			token = `Bot ${token}`;
		}
		this.options = { baseHost: Endpoints.BASE_HOST, disableEveryone: false, sentryOptions: { extra: { snowtransferVersion: version } }, useRedis: false };
		this.token = token;
		Object.assign(this.options, options);
		this.ratelimiter = new Ratelimiter();
		this.requestHandler = new RequestHandler(this.ratelimiter, {
			token: this.token,
			baseHost: this.options.baseHost || Endpoints.BASE_HOST
		});
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
	}
}

export = SnowTransfer;
