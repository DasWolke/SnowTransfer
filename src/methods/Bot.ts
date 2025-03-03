import Endpoints = require("../Endpoints");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTGetAPIGatewayBotResult,
	RESTGetAPIGatewayResult,
	APIApplication,
	RESTPatchCurrentApplicationJSONBody
} from "discord-api-types/v10";

/**
 * Methods for interacting with bot specific endpoints
 * @since 0.1.0
 */
class BotMethods {
	/**
	 * Create a new Bot Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.bot.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get the gateway url to connect to
	 * @since 0.1.0
	 * @returns [Gateway data](https://discord.com/developers/docs/topics/gateway#get-gateway-example-response)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.bot.getGateway()
	 * // result should be something like { url: "wss://gateway.discord.gg" }
	 */
	public async getGateway(): Promise<RESTGetAPIGatewayResult> {
		return this.requestHandler.request(Endpoints.GATEWAY, {}, "get", "json");
	}

	/**
	 * Get the gateway url to connect to and a recommended amount of shards to use
	 * @since 0.1.0
	 * @returns [Gateway data](https://discord.com/developers/docs/topics/gateway#get-gateway-example-response)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.bot.getGatewayBot()
	 * // result should be something like { url: "wss://gateway.discord.gg", shards: 1, session_start_limit: { total: 1000, remaining: 999, reset_after: 14400000, max_concurrency: 1 } }
	 */
	public async getGatewayBot(): Promise<RESTGetAPIGatewayBotResult> {
		return this.requestHandler.request(Endpoints.GATEWAY_BOT, {}, "get", "json");
	}

	/**
	 * Get the Application Object for the Current User
	 * @since 0.11.0
	 * @returns An [Application object](https://discord.com/developers/docs/resources/application#application-object-application-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const result = await client.bot.getApplicationInfo()
	 */
	public async getApplicationInfo(): Promise<APIApplication> {
		return this.requestHandler.request(Endpoints.OAUTH2_APPLICATION("@me"), {}, "get", "json");
	}

	/**
	 * Update the Application Object for the Current User
	 * @since 0.13.0
	 * @returns An [Application object](https://discord.com/developers/docs/resources/application#application-object-application-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const appData = {
	 * 	description: "My new bot description",
	 * 	interactions_endpoint_url: "https://mycoolbot.example/api/interactions"
	 * };
	 * client.bot.updateApplicationInfo(appData)
	 */
	public async updateApplicationInfo(data: RESTPatchCurrentApplicationJSONBody): Promise<APIApplication> {
		return this.requestHandler.request(Endpoints.OAUTH2_APPLICATION("@me"), {}, "patch", "json", data);
	}
}

export = BotMethods;
