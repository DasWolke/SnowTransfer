"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestHandler_1 = require("./RequestHandler");
const Ratelimiter_1 = require("./Ratelimiter");
const Endpoints_1 = require("./Endpoints");
const AuditLog_1 = require("./methods/AuditLog");
const Bots_1 = require("./methods/Bots");
const package_json_1 = require("../package.json");
const Channels_1 = require("./methods/Channels");
const Users_1 = require("./methods/Users");
const Emojis_1 = require("./methods/Emojis");
const Webhooks_1 = require("./methods/Webhooks");
const Invites_1 = require("./methods/Invites");
const Guilds_1 = require("./methods/Guilds");
const Voices_1 = require("./methods/Voices");
const node_1 = require("@sentry/node");
class SnowTransfer {
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
    constructor(token, options = {}) {
        if (!token || token === '') {
            throw new Error('Missing token');
        }
        if (!token.startsWith('Bot')) {
            token = `Bot ${token}`;
        }
        this.token = token;
        this.sentry = null;
        this.options = options;
        if (this.options.sentryDsn) {
            this.sentry = new node_1.NodeClient({ dsn: this.options.sentryDsn, release: package_json_1.version });
        }
        this.ratelimiter = new Ratelimiter_1.default();
        this.requestHandler = new RequestHandler_1.default(this.ratelimiter, {
            token: this.token,
            sentry: this.sentry,
            baseHost: this.options.baseHost || Endpoints_1.default.BASE_HOST
        });
        this.channel = new Channels_1.default(this.requestHandler);
        this.user = new Users_1.default(this.requestHandler);
        this.emoji = new Emojis_1.default(this.requestHandler);
        this.webhook = new Webhooks_1.default(this.requestHandler);
        this.guild = new Guilds_1.default(this.requestHandler);
        this.invite = new Invites_1.default(this.requestHandler);
        this.voice = new Voices_1.default(this.requestHandler);
        this.bot = new Bots_1.default(this.requestHandler);
        this.auditLog = new AuditLog_1.default(this.requestHandler);
    }
}
exports.default = SnowTransfer;
exports = module.exports = SnowTransfer;
//# sourceMappingURL=SnowTransfer.js.map