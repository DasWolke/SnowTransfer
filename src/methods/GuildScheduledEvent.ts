import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

/**
 * Methods for interacting with Guild Scheduled Events
 */
export class GuildScheduledEventMethods {
	public requestHandler: (typeof import("../RequestHandler"))["RequestHandler"]["prototype"];

	/**
	 * Create a new Guild Scheduled Event Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildScheduledEvent.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: GuildScheduledEventMethods["requestHandler"]) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get all scheduled events for a guild
	 * @param guildId The Id of the guild
	 * @param withCounts Include number of users subscribed to each event
	 * @returns An array of [guild scheduled events](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const events = await client.guildScheduledEvent.listGuildScheduledEvents(guildId)
	 */
	public async listGuildScheduledEvents(guildId: string, withCounts?: boolean): Promise<Array<import("discord-typings").GuildScheduledEvent>> {
		return this.requestHandler.request(`${Endpoints.GUILD_SCHEDULED_EVENTS(guildId)}${withCounts ? "?with_user_count=true" : ""}`, "get", "json");
	}

	/**
	 * Create a scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param data Data for the new scheduled event
	 * @returns A [scheduled event](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * | Permissions needed | Condition                        |
	 * |--------------------|----------------------------------|
	 * | MANAGE_EVENTS      | always                           |
	 * | MANAGE_CHANNELS    | If entity_type is STAGE_INSTANCE |
	 * | MUTE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | MOVE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | VIEW_CHANNEL       | If entity_type is VOICE          |
	 * | CONNECT            | If entity_type is VOICE          |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const eventData = {
	 * 	name: "My event!",
	 * 	entity_type: 1,
	 * 	start_time: "2020-01-01T00:00:00Z",
	 * 	privacy_level: 1
	 * }
	 * const event = await client.guildScheduledEvent.createGuildScheduledEvent(guildId, eventData)
	 */
	public async createGuildScheduledEvent(guildId: string, data: CreateGuildScheduledEventData): Promise<import("discord-typings").GuildScheduledEvent> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENTS(guildId), "post", "json", data);
	}

	/**
	 * Get a specific scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param withCount Include number of users subscribed to this event
	 * @returns A [scheduled event](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * | Permissions needed | Condition                                 |
	 * |--------------------|-------------------------------------------|
	 * | VIEW_CHANNEL       | if entity_type is STAGE_INSTANCE or VOICE |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const event = await client.guildScheduledEvent.getGuildScheduledEvent(guildId, eventId)
	 */
	public async getGuildScheduledEvent(guildId: string, eventId: string, withCount?: boolean): Promise<import("discord-typings").GuildScheduledEvent> {
		return this.requestHandler.request(`${Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId)}${withCount ? "?with_user_count=true" : ""}`, "get", "json");
	}

	/**
	 * Edit the details of a scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param data Edited scheduled event data
	 * @returns A [scheduled event](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * | Permissions needed | Condition                        |
	 * |--------------------|----------------------------------|
	 * | MANAGE_EVENTS      | always                           |
	 * | MANAGE_CHANNELS    | If entity_type is STAGE_INSTANCE |
	 * | MUTE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | MOVE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | VIEW_CHANNEL       | If entity_type is VOICE          |
	 * | CONNECT            | If entity_type is VOICE          |
	 *
	 * @example
	 * // Updates a scheduled event to be an external event that will take place in Brazil and end in 2025
	 * const client = new SnowTransfer("TOKEN")
	 * const event = await client.guildScheduledEvent.editGuildScheduledEvent(guildId, eventId, { entity_type: 3, channel_id: null, entity_metadata: { location: "Brazil" }, scheduled_end_time: "2025-01-01T00:00:00.000Z" })
	 */
	public async editGuildScheduledEvent(guildId: string, eventId: string, data: EditGuildScheduledEventData): Promise<import("discord-typings").GuildScheduledEvent> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId), "patch", "json", data);
	}

	/**
	 * Delete a specific scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @returns Resolves the promise on successful execution
	 *
	 * | Permissions needed | Condition                        |
	 * |--------------------|----------------------------------|
	 * | MANAGE_EVENTS      | always                           |
	 * | MANAGE_CHANNELS    | If entity_type is STAGE_INSTANCE |
	 * | MUTE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | MOVE_MEMBERS       | If entity_type is STAGE_INSTANCE |
	 * | VIEW_CHANNEL       | If entity_type is VOICE          |
	 * | CONNECT            | If entity_type is VOICE          |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.guildScheduledEvent.deleteGuildScheduledEvent(guildId, eventId)
	 */
	public async deleteGuildScheduledEvent(guildId: string, eventId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId), "delete", "json");
	}

	/**
	 * Get a list of users attending a specific event
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param options Options for how to get users
	 * @returns An array of [event users](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-user-object-guild-scheduled-event-user-structure)
	 *
	 * | Permissions needed | Condition                                 |
	 * |--------------------|-------------------------------------------|
	 * | VIEW_CHANNEL       | if entity_type is STAGE_INSTANCE or VOICE |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const users = await client.guildScheduledEvent.getGuildScheduledEventUsers(guildId, eventId)
	 */
	public async getGuildScheduledEventUsers(guildId: string, eventId: string, query?: GetGuildScheduledEventUsers): Promise<Array<import("discord-typings").GuildScheduledEventUser & { member?: import("discord-typings").Member }>> {
		if (query?.limit !== undefined && (query.limit < Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MIN_RESULTS || query.limit > Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS)) throw new RangeError(`The maximum amount of users that may be requested has to be between ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MIN_RESULTS} and ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS}`);
		return this.requestHandler.request(`${Endpoints.GUILD_SCHEDULED_EVENT_USERS(guildId, eventId)}${query ? Object.keys(query).map((v, index) => `${index === 0 ? "?" : "&"}${v}=${query[v]}`).join("") : ""}`, "get", "json");
	}
}

export type CreateGuildScheduledEventData = {
	channel_id?: string;
	entity_metadata?: import("discord-typings").GuildScheduledEventEntityMetadata;
	name: string;
	privacy_level: import("discord-typings").GuildScheduledEventPrivacyLevel;
	/**
	 * ISO8601 timestamp
	 */
	scheduled_start_time: string;
	/**
	 * ISO8601 timestamp
	 */
	scheduled_end_time?: string;
	description?: string;
	entity_type: import("discord-typings").GuildScheduledEventEntityType;
	/**
	 * base64-encoded image data used for the cover of the scheduled event
	 */
	image?: string;
	/**
	 * The reason for creating the scheduled event
	 */
	reason?: string;
}

export type EditGuildScheduledEventData = {
	channel_id?: string;
	entity_metadata?: import("discord-typings").GuildScheduledEventEntityMetadata;
	name?: string;
	privacy_level?: import("discord-typings").GuildScheduledEventPrivacyLevel;
	/**
	 * ISO8601 timestamp
	 */
	schedule_start_time?: string;
	/**
	 * ISO8601 timestamp
	 */
	schedule_end_time?: string;
	description?: string;
	entity_type?: import("discord-typings").GuildScheduledEventEntityType;
	/**
	 * the status of the scheduled event
	 */
	status?: import("discord-typings").GuildScheduledEventStatus;
	/**
	 * base64-encoded image data used for the cover of the scheduled event
	 */
	image?: string;
	/**
	 * The reason for editing the scheduled event
	 */
	reason?: string;
}

export type GetGuildScheduledEventUsers = {
	limit?: number;
	with_member?: boolean;
	before?: string;
	after?: string;
}
