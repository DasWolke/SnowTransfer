let Raven = require('raven');
let version = require('../package.json').version;
let Ratelimiter = require('./Ratelimiter');
let RequestHandler = require('./RequestHandler');
let ChannelMethods = require('./methods/Channels');
let UserMethods = require('./methods/Users');
let EmojiMethods = require('./methods/Emojis');
let WebhookMethods = require('./methods/Webhooks');
let GuildMethods = require('./methods/Guilds');

/**
 * The main client to use when you want to execute actions with the discord rest api
 * @property {ChannelMethods} channel
 * @property {UserMethods} user
 * @property {EmojiMethods} emoji
 * @property {WebhookMethods} webhook
 * @property {GuildMethods} guild
 */
class SnowTransfer {
    /**
     * Create a new Rest Client
     * @param {String} token - Discord Bot token to use
     * @param {Object} [options] - options
     * @param {String} [options.sentryDsn] - Dsn to use for the sentry integration, disables the integration when empty
     * @param {Object} [options.sentryOptions] - Options to use for the sentry client, check the [sentry docs](https://docs.sentry.io/clients/node/config/) for more infos
     * @constructor
     */
    constructor(token, options) {
        if (!token && token !== '') {
            throw new Error('Missing token');
        }
        if (!token.startsWith('Bot')) {
            token = `Bot ${token}`;
        }
        this.options = {sentryOptions: {extra: {version}}, useRedis: false};
        this.token = token;
        Object.assign(this.options, options);
        if (this.options.sentryDsn) {
            Raven.config(this.options.sentryDsn, this.options.sentryOptions);
            this.raven = Raven;
        }
        this.ratelimiter = new Ratelimiter();
        this.requestHandler = new RequestHandler(this.ratelimiter, {token: this.token});
        this.channel = new ChannelMethods(this.requestHandler);
        this.user = new UserMethods(this.requestHandler);
        this.emoji = new EmojiMethods(this.requestHandler);
        this.webhook = new WebhookMethods(this.requestHandler);
        this.guild = new GuildMethods(this.requestHandler);
    }
}

module.exports = SnowTransfer;