import Endpoints = require("../Endpoints");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIGuildTemplateResult,
	RESTGetAPIGuildTemplatesResult,
	RESTGetAPITemplateResult,
	RESTPatchAPIGuildTemplateJSONBody,
	RESTPatchAPIGuildTemplateResult,
	RESTPostAPIGuildTemplatesJSONBody,
	RESTPostAPIGuildTemplatesResult,
	RESTPutAPIGuildTemplateSyncResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Guild Templates
 * @since 0.3.0
 * @protected
 */
class GuildTemplateMethods {
	/**
	 * Create a new Guild Template Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildTemplate.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get a guild template by code
	 * @since 0.3.0
	 * @param code The code for the template
	 * @returns A [guild template](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const template = await client.guildTemplate.getGuildTemplate("code")
	 */
	public async getGuildTemplate(code: string): Promise<RESTGetAPITemplateResult> {
		return this.requestHandler.request(Endpoints.TEMPLATE(code), {}, "get", "json");
	}

	/**
	 * Gets all templates from a guild
	 * @since 0.3.0
	 * @param guildId The Id of the guild
	 * @returns An array of [guild templates](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const templates = await client.guildTemplate.getGuildTemplates("guildId")
	 */
	public async getGuildTemplates(guildId: string): Promise<RESTGetAPIGuildTemplatesResult> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATES(guildId), {}, "get", "json");
	}

	/**
	 * Creates a template from the current state of the guild
	 * @since 0.3.0
	 * @param guildId The Id of the guild
	 * @param data Metadata for the template
	 * @returns A [guild tempalte](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const template = await client.guildTemplate.createGuildTemplate("guildId", { name: "Cool guild template", description: "This is a cool guild template" })
	 */
	public async createGuildTemplate(guildId: string, data: RESTPostAPIGuildTemplatesJSONBody): Promise<RESTPostAPIGuildTemplatesResult> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATES(guildId), {}, "post", "json", data);
	}

	/**
	 * Updates a guild template to match the current state of the guild
	 * @since 0.3.0
	 * @param guildId The Id of the guild
	 * @param code The code of the template
	 * @returns A [guild template](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const template = await client.guildTemplate.syncGuildTemplate("guildId", "code")
	 */
	public async syncGuildTemplate(guildId: string, code: string): Promise<RESTPutAPIGuildTemplateSyncResult> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), {}, "put", "json");
	}

	/**
	 * Updates a guild template's metadata
	 * @since 0.3.0
	 * @param guildId The Id of the guild
	 * @param code The code of the template
	 * @param data Metadata for the template
	 * @returns A [guild template](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const template = await client.guildTemplate.modifyGuildTemplate("guildId", "code", { name: "Coolest guild template", description: "This is the coolest guild template hands down" })
	 */
	public async modifyGuildTemplate(guildId: string, code: string, data: RESTPatchAPIGuildTemplateJSONBody): Promise<RESTPatchAPIGuildTemplateResult> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), {}, "patch", "json", data);
	}

	/**
	 * Deletes a template from a guild
	 * @since 0.3.0
	 * @param guildId The Id of the guild
	 * @param code The code of the template
	 * @returns A [guild template](https://discord.com/developers/docs/resources/guild-template#guild-template-object-guild-template-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const template = await client.guildTemplate.deleteGuildTemplate("guildId", "code")
	 */
	public async deleteGuildTemplate(guildId: string, code: string): Promise<RESTDeleteAPIGuildTemplateResult> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), {}, "delete", "json");
	}
}

export = GuildTemplateMethods;
