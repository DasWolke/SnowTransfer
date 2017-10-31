const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with bot specific endpoints
 */
class BotMethods {
    /**
     * Create a new Bot Method Handler
     * @param {RequestHandler}requestHandler
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get the gateway url to connect to
     * @returns {Promise.<GatewayData>}
     */
    getGateway() {
        return this.requestHandler.request(Endpoints.GATEWAY, 'get', 'json');
    }

    /**
     * Get the gateway url to connect to and a recommended amount of shards to use
     * @returns {Promise.<GatewayData>}
     */
    getGatewayBot() {
        return this.requestHandler.request(Endpoints.GATEWAY_BOT, 'get', 'json');
    }
}

/**
 * @typedef {Object} GatewayData
 * @property {String} url - url to connect to
 * @property {Number} [shards] - number of shards, recommended by discord
 */

module.exports = BotMethods;