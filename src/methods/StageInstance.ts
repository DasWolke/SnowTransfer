import Endpoints = require("../Endpoints");

import type APITypes = require("discord-api-types/v10");

/**
 * Methods for interacting with Stage instances
 */
class StageInstanceMethods {
	public requestHandler: (typeof import("../RequestHandler"))["RequestHandler"]["prototype"];

	/**
	 * Create a new Stage Instance Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.stageInstance.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: StageInstanceMethods["requestHandler"]) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Creates a new stage instance associated to a stage channel
	 * @param data The options for creating a stage instance
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
	public async createStageInstance(data: APITypes.RESTPostAPIStageInstanceJSONBody & { reason?: string; }): Promise<APITypes.RESTPostAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCES, "post", "json", data);
	}

	/**
	 * Gets the stage instance assocuated to a stage channel if it exists
	 * @param channelId Id of the stage channel
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const instance = await client.stageInstance.getStageInstance("channel id")
	 */
	public async getStageInstance(channelId: string): Promise<APITypes.RESTGetAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), "get", "json");
	}

	/**
	 * Updates an existing stage instance
	 * @param channelId Id of the stage channel
	 * @param data The new data to send
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
	public async editStageInstance(channelId: string, data: APITypes.RESTPatchAPIStageInstanceJSONBody & { reason?: string; }): Promise<APITypes.RESTPatchAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), "patch", "json", data);
	}

	/**
	 * Delete an existing stage instance
	 * @param channelId Id of the stage channel
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
	public async deleteStageInstance(channelId: string, reason?: string): Promise<APITypes.RESTDeleteAPIStageInstanceResult> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), "delete", "json", reason ? { reason } : undefined) as APITypes.RESTDeleteAPIStageInstanceResult;
	}
}

export = StageInstanceMethods;
