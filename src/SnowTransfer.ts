import RequestHandler from "./RequestHandler";
import Ratelimiter from "./Ratelimiter";
import Endpoints from "./Endpoints";
import AuditLogMethods from "./methods/AuditLog";
import BotMethods from "./methods/Bots";
import { version } from "../package.json";
import ChannelMethods from "./methods/Channels";
import UserMethods from "./methods/Users";
import EmojiMethods from "./methods/Emojis";
import WebhookMethods from "./methods/Webhooks";
import InviteMethods from "./methods/Invites";
import GuildMethods from "./methods/Guilds";
import VoiceMethods from "./methods/Voices"
import {NodeClient as sentry, NodeOptions as sentryOptions} from "@sentry/node";

export interface TOptions {
    sentryDsn?: string,
    baseHost?: string,
    sentryOptions?: sentryOptions
}
class SnowTransfer {
    private options: { sentryDsn?: string, baseHost?: string }
    private sentry: null | sentry
    private token: string
    private requestHandler: RequestHandler
    private ratelimiter: Ratelimiter
    voice: VoiceMethods
    guild: GuildMethods
    invite: InviteMethods
    webhook: WebhookMethods
    emoji: EmojiMethods
    user: UserMethods
    bot: BotMethods
    auditLog: AuditLogMethods
    channel: ChannelMethods

    /**
     * Create a new Rest Client
     * @property {ChannelMethods} channel - Methods for channels
     * @property {UserMethods} user - Methods for users
     * @property {EmojiMethods} emoji - Methods for emojis
     * @property {WebhookMethods} webhook - Methods for webhooks
     * @property {GuildMethods} guild - Methods for guilds
     * @property {InviteMethods} invite - Methods for invites
     * @property {VoiceMethods} voice - Methods for voice
     * @property {BotMethods} bot - Methods for bot related things (e.g. Gateway endpoint)
     * @property {AuditLogMethods} auditLog - Methods for accessing the audit log of a guild
     * @property {Raven|null} [raven] - optional [sentry raven](https://docs.sentry.io/clients/node/config/) instance used for catching errors
     * @param {String} token - Discord Bot token to use
     * @param {Object} [options] - options
     * @param {String} [options.sentryDsn] - Dsn to use for the sentry integration, disables the integration when empty
     * @param {Object} [options.sentryOptions] - Options to use for the sentry client, check the [sentry docs](https://docs.sentry.io/clients/node/config/) for more infos
     * @param {String} [options.baseHost=https://discordapp.com] - Base host to use for the requests, may be replaced when using a local hosted proxy
     * @return {SnowTransfer} - created instance
     * @constructor
     */
    constructor(token: string, options: TOptions = {}) {
        if (!token || token === '') {
            throw new Error('Missing token');
        }
        if (!token.startsWith('Bot')) {
            token = `Bot ${token}`;
        }
        this.token = token;
        this.sentry = null;
        this.options = options
        if (this.options.sentryDsn) {
            this.sentry = new sentry({dsn: this.options.sentryDsn, release: version});
        }
        this.ratelimiter = new Ratelimiter();
        this.requestHandler = new RequestHandler(this.ratelimiter, {
            token: this.token,
            sentry: this.sentry,
            baseHost: this.options.baseHost || Endpoints.BASE_HOST
        });
        this.channel = new ChannelMethods(this.requestHandler);
        this.user = new UserMethods(this.requestHandler);
        this.emoji = new EmojiMethods(this.requestHandler);
        this.webhook = new WebhookMethods(this.requestHandler);
        this.guild = new GuildMethods(this.requestHandler);
        this.invite = new InviteMethods(this.requestHandler);
        this.voice = new VoiceMethods(this.requestHandler);
        this.bot = new BotMethods(this.requestHandler);
        this.auditLog = new AuditLogMethods(this.requestHandler);
    }
}

export default SnowTransfer;
exports = module.exports = SnowTransfer
