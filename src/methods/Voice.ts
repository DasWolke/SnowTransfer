import Endpoints = require("../Endpoints");

import type { RequestHandler as RH } from "../RequestHandler";

import type { RESTGetAPIVoiceRegionsResult, APIVoiceState } from "discord-api-types/v10";

/**
 * Methods for interacting with some voice
 * @since 0.1.0
 * @protected
 */
class VoiceMethods {
	/**
	 * Create a new Voice Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.voice.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get currently available voice regions that can be used when creating servers
	 * @since 0.1.0
	 * @returns Array of [voice region](https://discord.com/developers/docs/resources/voice#voice-region-object) objects
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const regions = await client.voice.getVoiceRegions()
	 */
	public async getVoiceRegions(): Promise<RESTGetAPIVoiceRegionsResult> {
		return this.requestHandler.request(Endpoints.VOICE_REGIONS, {}, "get", "json");
	}

	/**
	 * Get the CurrentUser's voice state for a guild
	 * @since 0.10.6
	 * @param guildId Id of the guild
	 * @returns A [voice state](https://discord.com/developers/docs/resources/voice#voice-state-object) object
	 */
	public async getCurrentUserVoiceState(guildId: string): Promise<APIVoiceState> {
		return this.requestHandler.request(Endpoints.USER_GUILD_VOICE_STATE(guildId, "@me"), {}, "get", "json")
	}

	/**
	 * Get a user's voice state for a guild
	 * @since 0.10.6
	 * @param guildId Id of the guild
	 * @param userId Id of the user
	 * @returns A [voice state](https://discord.com/developers/docs/resources/voice#voice-state-object) object
	 */
	public async getUserVoiceState(guildId: string, userId: string): Promise<APIVoiceState> {
		return this.requestHandler.request(Endpoints.USER_GUILD_VOICE_STATE(guildId, userId), {}, "get", "json")
	}
}

export = VoiceMethods;
