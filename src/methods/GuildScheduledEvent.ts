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

	public async listGuildScheduledEvents(guildId: string, options: { with_user_count?: boolean; } = { with_user_count: false }): Promise<Array<import("discord-typings").GuildScheduleEventData>> {
		return this.requestHandler.request(Endpoints.SCHEDULED_EVENTS(guildId) + (options?.with_user_count ? "?with_user_count=true" : ""), "get", "json");
	}
	
	public async createGuildScheduledEvent(guildId: string, data: CreateGuildScheduleEvent): Promise<import("discord-typings").GuildScheduleEventData> {
		return this.requestHandler.request(Endpoints.SCHEDULED_EVENTS(guildId), "post", "json", data);
	}

	public async getGuildScheduledEvent(guildId: string, eventId: string, options: { with_user_count?: boolean; } = { with_user_count: false }): Promise<import("discord-typings").GuildScheduleEventData> {
		return this.requestHandler.request(Endpoints.SCHEDULED_EVENT(guildId, eventId) + (options?.with_user_count ? "?with_user_count=true" : ""), "get", "json");
	}

	public async editGuildScheduledEvent(guildId: string, eventId: string, data: EditGuildScheduleEvent): Promise<import("discord-typings").GuildScheduleEventData> {
		return this.requestHandler.request(Endpoints.SCHEDULED_EVENT(guildId, eventId), "patch", "json", data);
	}

	public async deleteGuildScheduledEvent(guildId: string, eventId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.SCHEDULED_EVENT(guildId, eventId), "delete", "json");
	}

	public async getGuildScheduledEventUsers(guildId: string, eventId: string, options: GetGuildScheduledEventUsers = { limit: 50 }): Promise<Array<GuildScheduledEventUsersData>> {
		if (options.limit && options.limit > Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS) {
			throw new Error(`The maximum amount of users that may be requested is ${Constants.GET_GUILD_SCHEDULED_EVENT_USERS_MAX_RESULTS}`);
		}
		const qs: string = Object.keys(options).map(key => `${key}=${options[key]}`).join("&");
		return this.requestHandler.request(Endpoints.SCHEDULE_EVENT_USERS(guildId, eventId) + (qs ? `?${qs}` : ""), "get", "json");
	}
}

interface CreateGuildScheduleEvent {
	channel_id?: string;
	entity_metadata?: { location?: string } ;
	name: string;
	privacy_level: 2;
	scheduled_start_time: string;
	scheduled_end_time?: string;
	description?: string;
	entity_type: 1 | 2 | 3;
	/**
	 * base64 jpeg image for the scheduled event cover image
	 */
	image?: string;
	reason?: string;
}

interface EditGuildScheduleEvent {
	channel_id?: string;
	entity_metadata?: { location?: string } ;
	name?: string;
	privacy_level?: 2;
	scheduled_start_time?: string;
	scheduled_end_time?: string;
	description?: string;
	entity_type?: 1 | 2 | 3;
	/**
	 * base64 jpeg image for the scheduled event cover image
	 */
	image?: string;
	status?: 1 | 2 | 3 | 4;
	reason?: string;
}

interface GetGuildScheduledEventUsers {
	/**
	 * Number of users to get, values between 1-100 allowed
	 */
	limit?: number;
	with_member?: boolean;
	before?: string;
	after?: string;
}

interface GuildScheduledEventUsersData {
	guild_scheduled_event_id: string;
	user: import("discord-typings").UserData;
	member?: import("discord-typings").MemberData;
}

export = GuildScheduledEventMethods;
