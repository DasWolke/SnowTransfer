import Endpoints from "../Endpoints";

/**
 * Methods for interacting with Stage instances
 */
class StageInstanceMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Stage Instance Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.stageInstance.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
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
	 */
	public async createStageInstance(data: { channel_id: string; topic: string; }): Promise<import("@amanda/discordtypings").StageInstanceData> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCES, "post", "json", data);
	}

	/**
	 * Gets the stage instance assocuated to a stage channel if it exists
	 * @param channelId Id of the stage channel
	 * @returns a [stage instance](https://discord.com/developers/docs/resources/stage-instance#auto-closing-stage-instance-structure) object
	 */
	public async getStageInstance(channelId: string): Promise<import("@amanda/discordtypings").StageInstanceData> {
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
	 */
	public async editStageInstance(channelId: string, data: { topic: string}): Promise<import("@amanda/discordtypings").StageInstanceData> {
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
	 */
	public async deleteStageInstance(channelId: string): Promise<import("@amanda/discordtypings").StageInstanceData> {
		return this.requestHandler.request(Endpoints.STAGE_INSTANCE_CHANNEL(channelId), "delete", "json");
	}
}

export = StageInstanceMethods;
