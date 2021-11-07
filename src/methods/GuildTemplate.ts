import Endpoints from "../Endpoints";

/**
 * Methods for interacting with Guild Templates
 */
class GuildTemplateMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Guild Template Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.guildTemplate.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	public getGuildTemplate(code: string): Promise<import("discord-typings").GuildTemplateData> {
		return this.requestHandler.request(Endpoints.TEMPLATE(code), "get", "json");
	}

	public createGuildFromGuildTemplate(code: string, options: { name: string; icon?: string | null; }): Promise<import("discord-typings").GuildData> {
		return this.requestHandler.request(Endpoints.TEMPLATE(code), "post", "json", options);
	}

	/**
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public getGuildTemplates(guildId: string): Promise<Array<import("discord-typings").GuildTemplateData>> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATES(guildId), "get", "json");
	}

	/**
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public createGuildTemplate(guildId: string, data: { name: string; description?: string | null; }): Promise<import("discord-typings").GuildTemplateData> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATES(guildId), "post", "json", data);
	}

	/**
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public syncGuildTemplate(guildId: string, code: string): Promise<import("discord-typings").GuildTemplateData> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), "put", "json");
	}

	/**
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public modifyGuildTemplate(guildId: string, code: string, data: { name?: string; description?: string | null; }): Promise<import("discord-typings").GuildTemplateData> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), "patch", "json", data);
	}

	/**
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 */
	public deleteGuildTemplate(guildId: string, code: string): Promise<import("discord-typings").GuildTemplateData> {
		return this.requestHandler.request(Endpoints.GUILD_TEMPLATE(guildId, code), "delete", "json");
	}
}

export = GuildTemplateMethods;
