import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIGuildScheduledEventResult,
	RESTGetAPIGuildScheduledEventResult,
	RESTGetAPIGuildScheduledEventUsersQuery,
	RESTGetAPIGuildScheduledEventUsersResult,
	RESTGetAPIGuildScheduledEventsResult,
	RESTPatchAPIGuildScheduledEventJSONBody,
	RESTPatchAPIGuildScheduledEventResult,
	RESTPostAPIGuildScheduledEventJSONBody,
	RESTPostAPIGuildScheduledEventResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Guild Scheduled Events
 * @since 0.3.6
 */
class GuildScheduledEventMethods {
	/**
	 * Create a new Guild Scheduled Event Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildScheduledEvent.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get all scheduled events for a guild
	 * @since 0.3.6
	 * @param guildId The Id of the guild
	 * @param withCounts Include number of users subscribed to each event
	 * @returns An array of [guild scheduled events](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const events = await client.guildScheduledEvent.listGuildScheduledEvents(guildId)
	 */
	public async listGuildScheduledEvents(guildId: string, withCounts?: boolean): Promise<RESTGetAPIGuildScheduledEventsResult> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENTS(guildId), { with_user_count: withCounts }, "get", "json");
	}

	/**
	 * Create a scheduled event for a guild
	 * @since 0.3.6
	 * @param guildId The Id of the guild
	 * @param data Data for the new scheduled event
	 * @param reason Reason for creating the scheduled event
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
	public async createGuildScheduledEvent(guildId: string, data: RESTPostAPIGuildScheduledEventJSONBody, reason?: string): Promise<RESTPostAPIGuildScheduledEventResult> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENTS(guildId), {}, "post", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Get a specific scheduled event for a guild
	 * @since 0.3.6
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param withCounts Include number of users subscribed to this event
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
	public async getGuildScheduledEvent(guildId: string, eventId: string, withCounts?: boolean): Promise<RESTGetAPIGuildScheduledEventResult> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId), {}, "get", "json", { with_user_count: withCounts });
	}

	/**
	 * Edit the details of a scheduled event for a guild
	 * @since 0.3.6
	 * @param guildId The Id of the guild
	 * @param eventId The Id of the event
	 * @param data Edited scheduled event data
	 * @param reason Reason for editing the scheduled event
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
	public async editGuildScheduledEvent(guildId: string, eventId: string, data: RESTPatchAPIGuildScheduledEventJSONBody, reason?: string): Promise<RESTPatchAPIGuildScheduledEventResult> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId), {}, "patch", "json", data, Constants.reasonHeader(reason));
	}

	/**
	 * Delete a specific scheduled event for a guild
	 * @since 0.3.6
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
	public async deleteGuildScheduledEvent(guildId: string, eventId: string): Promise<RESTDeleteAPIGuildScheduledEventResult> {
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT(guildId, eventId), {}, "delete", "json") as RESTDeleteAPIGuildScheduledEventResult;
	}

	/**
	 * Get a list of users attending a specific event
	 * @since 0.3.6
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
	public async getGuildScheduledEventUsers(guildId: string, eventId: string, options?: RESTGetAPIGuildScheduledEventUsersQuery): Promise<RESTGetAPIGuildScheduledEventUsersResult> {
		if (options?.limit !== undefined && (options.limit < Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MIN_RESULTS || options.limit > Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS)) throw new RangeError(`The maximum amount of users that may be requested has to be between ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MIN_RESULTS} and ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS}`);
		return this.requestHandler.request(Endpoints.GUILD_SCHEDULED_EVENT_USERS(guildId, eventId), options, "get", "json");
	}
}

export = GuildScheduledEventMethods;
