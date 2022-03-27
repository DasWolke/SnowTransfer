import Endpoints from "../Endpoints";
import Constants from "../Constants";

/**
 * Methods for interacting with Guild Scheduled Events
 */
class GuildScheduledEventMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Guild Scheduled Event Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildscheduledevent.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get all scheduled events for a guild
	 * @param guildId The Id of the guild
	 * @param options Options for if how many users will be or are attending
	 * @returns An array of [guild scheduled events](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * | Permissions needed | Condition                                 |
	 * |--------------------|-------------------------------------------|
	 * | VIEW_CHANNEL       | if entity_type is STAGE_INSTANCE or VOICE |
	 */
	public async listGuildScheduledEvents(guildId: string, options: { with_user_count?: boolean; } = { with_user_count: false }): Promise<Array<import("discord-typings").GuildScheduledEvent>> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENTS(guildId) + (options?.with_user_count ? "?with_user_count=true" : ""), "get", "json");
	}

	/**
	 * Create a scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param data Create data
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
	 */
	public async createGuildScheduledEvent(guildId: string, data: CreateGuildScheduleEvent): Promise<import("discord-typings").GuildScheduledEvent> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENTS(guildId), "post", "json", data);
	}

	/**
	 * Get a specific scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param options Options for if how many users will be or are attending
	 * @returns A [scheduled event](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * | Permissions needed | Condition                                 |
	 * |--------------------|-------------------------------------------|
	 * | VIEW_CHANNEL       | if entity_type is STAGE_INSTANCE or VOICE |
	 */
	public async getGuildScheduledEvent(guildId: string, eventId: string, options: { with_user_count?: boolean; } = { with_user_count: false }): Promise<import("discord-typings").GuildScheduledEvent> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId) + (options?.with_user_count ? "?with_user_count=true" : ""), "get", "json");
	}

	/**
	 * Edit the details of a scheduled event for a guild
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param data Edit data
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
	 */
	public async editGuildScheduledEvent(guildId: string, eventId: string, data: EditGuildScheduleEvent): Promise<import("discord-typings").GuildScheduledEvent> {
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
	 */
	public async getGuildScheduledEventUsers(guildId: string, eventId: string, options: GetGuildScheduledEventUsers = { limit: 50 }): Promise<Array<import("discord-typings").GuildScheduledEventUser & { member?: import("discord-typings").Member }>> {
		if (options.limit && options.limit > Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS) throw new Error(`The maximum amount of users that may be requested is ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS}`);
		const qs: string = Object.keys(options).map(key => `${key}=${options[key]}`).join("&");
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT_USERS(guildId, eventId) + (qs ? `?${qs}` : ""), "get", "json");
	}
}

type CreateGuildScheduleEvent = Pick<import("discord-typings").GuildScheduledEvent, "entity_metadata" | "name" | "privacy_level" | "scheduled_start_time" | "description" | "entity_type"> & { reason?: string; channel_id?: import("discord-typings").Snowflake; scheduled_end_time?: string; image?: string; };

type EditGuildScheduleEvent = Partial<Pick<import("discord-typings").GuildScheduledEvent, "entity_metadata" | "name" | "privacy_level" | "scheduled_start_time" | "description" | "entity_type"> & { reason: string; channel_id: import("discord-typings").Snowflake; scheduled_end_time: string; image: string; }>;

interface GetGuildScheduledEventUsers {
	/**
	 * Number of users to get, values between 1-100 allowed
	 */
	limit?: number;
	with_member?: boolean;
	before?: string;
	after?: string;
}

export = GuildScheduledEventMethods;
