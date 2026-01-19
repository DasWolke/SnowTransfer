import type { RequestHandler as RH } from "../RequestHandler";

import Endpoints = require("../Endpoints");

import type {
	RESTGetAPIEntitlementsResult,
	RESTGetAPIEntitlementResult,
	RESTPostAPIEntitlementConsumeResult,
	RESTPostAPIEntitlementJSONBody,
	RESTPostAPIEntitlementResult,
	RESTDeleteAPIEntitlementResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Entitelements
 * @since 0.13.0
 * @protected
 */
class EntitlementMethods {
	/**
	 * Create a new Entitement Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.entitlement.method` where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Returns all entitlements for a given app, active and expired
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @returns Array of [entitlement objects](https://discord.com/developers/docs/resources/entitlement#entitlement-object)
	 *
	 * @example
	 * // Get all entitlements for an app
	 * const client = new SnowTransfer("TOKEN")
	 * const entitlements = await client.entitlement.getEntitlements("app id")
	 */
	public async getEntitlements(appId: string): Promise<RESTGetAPIEntitlementsResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ENTITLEMENTS(appId), {}, "get", "json");
	}

	/**
	 * Get a single entitlement for a given app via Id
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param entitlementId Id of the entitlement
	 * @returns [entitlement object](https://discord.com/developers/docs/resources/entitlement#entitlement-object)
	 *
	 * @example
	 * // Get an entitlement for an app by Id
	 * const client = new SnowTransfer("TOKEN")
	 * const entitlement = await client.entitlement.getEntitlement("app id", "entitlement id")
	 */
	public async getEntitlement(appId: string, entitlementId: string): Promise<RESTGetAPIEntitlementResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ENTITLEMENT(appId, entitlementId), {}, "get", "json");
	}

	/**
	 * For One-Time Purchase consumable SKUs, marks a given entitlement for the user as consumed
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param entitlementId Id of the entitlement
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * // Consume an entitlement
	 * const client = new SnowTransfer("TOKEN")
	 * client.entitlement.consumeEntitlement("app id", "entitlement id")
	 */
	public async consumeEntitlement(appId: string, entitlementId: string): Promise<RESTPostAPIEntitlementConsumeResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ENTITLEMENT_CONSUME(appId, entitlementId), {}, "post", "json") as Promise<RESTPostAPIEntitlementConsumeResult>;
	}

	/**
	 * Creates a test entitlement to a given SKU for a given guild or user. Discord will act as though that user or guild has entitlement to your premium offering
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param data Data to send
	 * @returns Partial [entitlement object](https://discord.com/developers/docs/resources/entitlement#entitlement-object)
	 *
	 * @example
	 * // Create a test entitlement for a user
	 * const client = new SnowTransfer("TOKEN")
	 * const entitlement = await client.entitlement.createTestEntitlement("app id", {
	 * 	sku_id: "sku id",
	 * 	owner_id: "user id",
	 * 	owner_type: 2 // type 2 is for a user. Type 1 is for a guild
	 * })
	 */
	public async createTestEntitlement(appId: string, data: RESTPostAPIEntitlementJSONBody): Promise<RESTPostAPIEntitlementResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ENTITLEMENTS(appId), {}, "post", "json", data);
	}

	/**
	 * Deletes a currently-active test entitlement. Discord will act as though that user or guild no longer has entitlement to your premium offering
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @param entitlementId Id of the entitlement
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * // Delete a test entitlement
	 * const client = new SnowTransfer("TOKEN")
	 * client.entitlement.deleteTestEntitlement("app id", "entitlement id")
	 */
	public async deleteTestEntitlement(appId: string, entitlementId: string): Promise<RESTDeleteAPIEntitlementResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_ENTITLEMENT(appId, entitlementId), {}, "delete", "json") as Promise<RESTDeleteAPIEntitlementResult>;
	}
}

export = EntitlementMethods;
