let Raven = require('raven');
let version = require('../package.json').version;
let Ratelimiter = require('./Ratelimiter');
let RequestHandler = require('./RequestHandler');
let ChannelMethods = require('./methods/Channels');
let UserMethods = require('./methods/Users');
let EmojiMethods = require('./methods/Emojis');
let WebhookMethods = require('./methods/Webhooks');
let GuildMethods = require('./methods/Guilds');
let InviteMethods = require('./methods/Invites');
let VoiceMethods = require('./methods/Voices');
let BotMethods = require('./methods/Bots');
let AuditLogMethods = require('./methods/AuditLog');
const Endpoints = require('./Endpoints');

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
     * @param {Boolean} [options.disableEveryone=false] - Disable @everyone/@here on messages sent
     * @param {String} [options.sentryDsn] - Dsn to use for the sentry integration, disables the integration when empty
     * @param {Object} [options.sentryOptions] - Options to use for the sentry client, check the [sentry docs](https://docs.sentry.io/clients/node/config/) for more infos
     * @param {String} [options.baseHost=https://discordapp.com] - Base host to use for the requests, may be replaced when using a local hosted proxy
     * @return {SnowTransfer} - created instance
     * @constructor
     */
    constructor(token, options) {
        if (!token || token === '') {
            throw new Error('Missing token');
        }
        if (!token.startsWith('Bot')) {
            token = `Bot ${token}`;
        }
        this.options = {disableEveryone: false, sentryOptions: {extra: {snowtransferVersion: version}}, useRedis: false};
        this.token = token;
        this.raven = null;
        Object.assign(this.options, options);
        if (this.options.sentryDsn) {
            Raven.config(this.options.sentryDsn, this.options.sentryOptions);
            this.raven = Raven;
        }
        this.ratelimiter = new Ratelimiter();
        this.requestHandler = new RequestHandler(this.ratelimiter, {
            token: this.token,
            raven: this.raven,
            baseHost: this.options.baseHost || Endpoints.BASE_HOST
        });
        this.channel = new ChannelMethods(this.requestHandler, this.options.disableEveryone);
        this.user = new UserMethods(this.requestHandler);
        this.emoji = new EmojiMethods(this.requestHandler);
        this.webhook = new WebhookMethods(this.requestHandler, this.options.disableEveryone);
        this.guild = new GuildMethods(this.requestHandler);
        this.invite = new InviteMethods(this.requestHandler);
        this.voice = new VoiceMethods(this.requestHandler);
        this.bot = new BotMethods(this.requestHandler);
        this.auditLog = new AuditLogMethods(this.requestHandler);
    }
}

module.exports = SnowTransfer;
