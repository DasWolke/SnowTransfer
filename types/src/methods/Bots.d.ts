import RequestHandler from "../RequestHandler";
import { TGatewayData } from "../LibTypes";
/**
 * Methods for interacting with bot specific endpoints
 */
declare class BotMethods {
    private requestHandler;
    /**
     * Create a new Bot Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.bot.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler request handler that calls the rest api
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Get the gateway url to connect to
     * @returns  {Promise.<GatewayData>} [Gateway data](https://discordapp.com/developers/docs/topics/gateway#get-gateway-example-response)
     * @example
     * let client = new SnowTransfer('TOKEN');
     * let result = await client.bot.getGateway();
     * // result should be something like {"url": "wss://gateway.discord.gg"}
     */
    getGateway(): Promise<TGatewayData>;
    /**
     * Get the gateway url to connect to and a recommended amount of shards to use
     * @returns {Promise.<GatewayData>} [Gateway data](https://discordapp.com/developers/docs/topics/gateway#get-gateway-example-response)
     * @example
     * let client = new SnowTransfer('TOKEN');
     * let result = await client.bot.getGateway();
     * // result should be something like {"url": "wss://gateway.discord.gg", "shards": 1}
     */
    getGatewayBot(): Promise<TGatewayData>;
}
/**
 * @typedef {Object} GatewayData
 * @property {String} url - url to connect to
 * @property {Number} [shards] - number of shards, recommended by discord
 */
export default BotMethods;
//# sourceMappingURL=Bots.d.ts.map