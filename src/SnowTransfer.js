let Raven = require('raven');
let version = require('../package.json').version;
let Ratelimiter = require('./Ratelimiter');
let RequestHandler = require('./RequestHandler');
let ChannelMethods = require('./methods/Channels');

/**
 * The main client to use when you want to execute actions with the discord rest api
 */
class SnowTransfer {
    /**
     * Create a new Rest Client
     * @param {String} token - Discord Bot token to use
     * @param {Object} [options] - options
     * @param {boolean} [options.useRedis=false] - whether to use redis for ratelimit storage
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
        if (this.options.useRedis) {

        }
        this.ratelimiter = new Ratelimiter();
        this.requestHandler = new RequestHandler(this.ratelimiter, {token: this.token});
        this.channel = new ChannelMethods(this.requestHandler);
    }
}

module.exports = SnowTransfer;