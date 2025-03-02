import type { RequestHandler as RH } from "../RequestHandler";

import Endpoints = require("../Endpoints");

import type {
	RESTGetAPISKUsResult,
	RESTGetAPISKUSubscriptionsQuery,
	RESTGetAPISKUSubscriptionsResult,
	RESTGetAPISKUSubscriptionResult,
} from "discord-api-types/v10";

/**
 * Methods for interacting with SKUs
 * @since 0.13.0
 */
class SkuMethods {
	/**
	 * Create a new SKU Method handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.subscription.method` where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Returns all SKUs for a given application.
	 * @since 0.13.0
	 * @param appId Id of the app
	 * @returns Array of [SKU objects](https://discord.com/developers/docs/resources/sku#sku-object)
	 *
	 * @example
	 * // Get all SKUs for an app
	 * const client = new SnowTransfer("TOKEN")
	 * const skus = await client.sku.GetSkus("app id")
	 */
	public async GetSkus(appId: string): Promise<RESTGetAPISKUsResult> {
		return this.requestHandler.request(Endpoints.APPLICATION_SKUS(appId), {}, "get", "json");
	}

	/**
	 * Returns all subscriptions containing the SKU, filtered by user.
	 * @since 0.13.0
	 * @param skuId Id of the SKU
	 * @param options Query data (required with at least `user_id` unless using an OAuth token)
	 * @returns Array of [subscription objects](https://discord.com/developers/docs/resources/subscription#subscription-object)
	 *
	 * @example
	 * // Get all subscriptions for a user
	 * const client = new SnowTransfer("TOKEN")
	 * const filter = { user_id: "user id" }
	 * const subscriptions = await client.sku.getSubscriptions("sku id", filter)
	 */
	public async getSubscriptions(skuId: string, options: RESTGetAPISKUSubscriptionsQuery = {}): Promise<RESTGetAPISKUSubscriptionsResult> {
		return this.requestHandler.request(Endpoints.SKU_SUBSCRIPTIONS(skuId), options, "get", "json");
	}

	/**
	 * Get a subscription by its ID.
	 * @since 0.13.0
	 * @param skuId Id of the SKU
	 * @param subscriptionId Id of the subscription
	 * @returns A [subscription object](https://discord.com/developers/docs/resources/subscription#subscription-object)
	 *
	 * @example
	 * // Get a subscription for a SKU by Id
	 * const client = new SnowTransfer("TOKEN")
	 * const subscription = await client.sku.getSubscription("sku id", "subscription id")
	 */
	public async getSubscription(skuId: string, subscriptionId: string): Promise<RESTGetAPISKUSubscriptionResult> {
		return this.requestHandler.request(Endpoints.SKU_SUBSCRIPTION(skuId, subscriptionId), {}, "get", "json");
	}
}

export = SkuMethods;
