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
     * @param {string} token - Discord Bot token to use
     * @param {object} [options] - options
     * @param {string} [options.baseHost] - Base host to use for the requests, may be replaced when using a local hosted proxy
     * @param {boolean} [options.disableEveryone=false] - Disable @everyone/@here on messages sent
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
        Object.assign(this.options, options);
        this.ratelimiter = new Ratelimiter();
        this.requestHandler = new RequestHandler(this.ratelimiter, {
            token: this.token,
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
