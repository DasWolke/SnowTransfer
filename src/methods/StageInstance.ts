import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIStageInstanceResult,
	RESTGetAPIStageInstanceResult,
	RESTPatchAPIStageInstanceJSONBody,
	RESTPatchAPIStageInstanceResult,
	RESTPostAPIStageInstanceJSONBody,
	RESTPostAPIStageInstanceResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Stage instances
 * @since 0.3.0
 */
class StageInstanceMethods {
	/**
	 * Create a new Stage Instance Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.stageInstance.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Creates a new stage instance associated to a stage channel
	 * @since 0.3.0
	 * @param data The options for creating a stage instance
	 * @param reason Reason for creating the stage instance
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 * | MUTE_MEMBERS       | always    |
	 * | MOVE_MEMBERS       | always    |
	 *
	 * @example
	 * // Create a new stage instance for channel id and the topic "This My House"
	 * const client = new SnowTransfer("TOKEN")
	 * const instance = await client.stageInstance.createStageInstance({ channel_id: "channel id", topic: "This My House" })
	 */
	public async createStageInstance(data: RESTPostAPIStageInstanceJSONBody, reason?: string): Promise<RESTPostAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCES, {}, "post", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Gets the stage instance associated to a stage channel if it exists
	 * @since 0.3.0
	 * @param channelId Id of the stage channel
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const instance = await client.stageInstance.getStageInstance("channel id")
	 */
	public async getStageInstance(channelId: string): Promise<RESTGetAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), {}, "get", "json");
	}

	/**
	 * Updates an existing stage instance
	 * @since 0.3.0
	 * @param channelId Id of the stage channel
	 * @param data The new data to send
	 * @param reason Reason for editing the stage instance
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 * | MUTE_MEMBERS       | always    |
	 * | MOVE_MEMBERS       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const instance = await client.stageInstance.updateStageInstance("channel id", { topic: "This my city, this my town" })
	 */
	public async editStageInstance(channelId: string, data: RESTPatchAPIStageInstanceJSONBody, reason?: string): Promise<RESTPatchAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), {}, "patch", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Delete an existing stage instance
	 * @since 0.3.0
	 * @param channelId Id of the stage channel
	 * @param reason Reason for deleting the stage instance
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 * | MUTE_MEMBERS       | always    |
	 * | MOVE_MEMBERS       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.stageInstance.deleteStageInstance("channel id", "They already know who's house this is")
	 */
	public async deleteStageInstance(channelId: string, reason?: string): Promise<RESTDeleteAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), {}, "delete", "json", {}, Constants.reasonHeader(reason)) as RESTDeleteAPIStageInstanceResult;
	}
}

export = StageInstanceMethods;
