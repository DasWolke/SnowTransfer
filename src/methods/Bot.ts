import Endpoints = require("../Endpoints");

import type { RequestHandler } from "../RequestHandler";

import type {
	RESTGetAPIGatewayBotResult,
	RESTGetAPIGatewayResult,
	APIApplication,
	RESTGetAPIApplicationActivityInstanceResult,
	RESTGetAPIApplicationRoleConnectionMetadataResult,
	RESTPatchCurrentApplicationJSONBody,
	RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
	RESTPutAPIApplicationRoleConnectionMetadataResult
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
	public constructor(public readonly requestHandler: RequestHandler) {}

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
	 * @since 0.18.0
	 * @returns An [Application object](https://discord.com/developers/docs/resources/application#application-object-application-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const appData = {
	 * 	description: "My new bot description",
	 * 	interactions_endpoint_url: "https://mycoolbot.example/api/interactions"
	 * };
	 * client.bot.editApplicationInfo(appData)
	 */
	public async editApplicationInfo(data: RESTPatchCurrentApplicationJSONBody): Promise<APIApplication> {
		return this.requestHandler.request(Endpoints.APPLICATION("@me"), {}, "patch", "json", data);
	}

	/**
	 * Get the role connection metadata records of an app
	 * @since 0.20.0
	 * @param appId Id of the app
	 * @returns An Array of [role connection metadata objects](https://docs.discord.com/developers/resources/application-role-connection-metadata#application-role-connection-metadata-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const records = await client.bot.getApplicationRoleConnectionMetadata("app id")
	 */
	public async getApplicationRoleConnectionMetadata(appId: string): Promise<RESTGetAPIApplicationRoleConnectionMetadataResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ROLE_CONNECTION_METADATA(appId), {}, "get", "json");
	}

	/**
	 * Replace the role connection metadata records of an app. An app can have up to 5 records
	 * @since 0.20.0
	 * @param appId Id of the app
	 * @param data The full list of records. Records left out are removed
	 * @returns An Array of [role connection metadata objects](https://docs.discord.com/developers/resources/application-role-connection-metadata#application-role-connection-metadata-object)
	 *
	 * @example
	 * // Lets server admins require members to have at least 10 cookies for a linked role
	 * const client = new SnowTransfer("TOKEN")
	 * const records = await client.bot.editApplicationRoleConnectionMetadata("app id", [{
	 * 	type: ApplicationRoleConnectionMetadataType.IntegerGreaterThanOrEqual,
	 * 	key: "cookies",
	 * 	name: "Cookies",
	 * 	description: "Cookies eaten"
	 * }])
	 */
	public async editApplicationRoleConnectionMetadata(appId: string, data: RESTPutAPIApplicationRoleConnectionMetadataJSONBody): Promise<RESTPutAPIApplicationRoleConnectionMetadataResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ROLE_CONNECTION_METADATA(appId), {}, "put", "json", data);
	}

	/**
	 * Get a running activity instance of an app
	 * @since 0.20.0
	 * @param appId Id of the app
	 * @param instanceId Id of the activity instance
	 * @returns An [activity instance object](https://docs.discord.com/developers/resources/application#get-application-activity-instance-activity-instance-object)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const instance = await client.bot.getActivityInstance("app id", "instance id")
	 */
	public async getActivityInstance(appId: string, instanceId: string): Promise<RESTGetAPIApplicationActivityInstanceResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ACTIVITY_INSTANCE(appId, instanceId), {}, "get", "json");
	}
}

export = BotMethods;
