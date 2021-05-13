import Endpoints from "../Endpoints";

type WebhookMethods = import("./Webhooks");

/**
 * Methods for interacting with slash command specific endpoints
 */
class InteractionMethods {
	public requestHandler: import("../RequestHandler");
	public webhooks: import("./Webhooks");

	/**
	 * Create a new Interaction Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.interaction.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler"), webhooks: import("./Webhooks")) {
		this.requestHandler = requestHandler;
		this.webhooks = webhooks;
	}

	public getApplicationCommands(appID: string) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "get", "json");
	}

	public getApplicationCommand(appID: string, cmdID: string) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "get", "json");
	}

	public createApplicationCommand(appID: string, data: CommandData) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "post", "json", data);
	}

	public editApplicationCommand(appID: string, cmdID: string, data: Partial<CommandData>) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "patch", "json", data);
	}

	public bulkOverwriteApplicationCommands(appID, data: Array<CommandData>) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "put", "json", data);
	}

	public deleteApplicationCommand(appID: string, cmdID: string) {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "delete", "json");
	}

	public getGuildApplicationCommands(appID: string, guildID: string) {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "get", "json");
	}

	public getGuildApplicationCommand(appID: string, guildID: string, cmdID: string) {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "get", "json");
	}

	public createGuildApplicationCommand(appID: string, guildID: string, data: CommandData) {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "post", "json", data);
	}

	public editGuildApplicationCommand(appID: string, guildID: string, cmdID: string, data: Partial<CommandData>) {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "patch", "json", data);
	}

	public bulkOverwriteGuildApplicationCommand(appID: string, guildID: string, data: Array<CommandData>) {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "put", "json", data);
	}

	public deleteGuildApplicationCommand(appID: string, guildID: string, cmdID: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "delete", "json");
	}

	public getOriginalInteractionResponse(appID: string, token: string): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.getWebhookMessage(appID, token, "@original");
	}

	public createInteractionResponse(appID: string, token: string, data: import("@amanda/discordtypings").InteractionResponseData): Promise<void> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(appID, token), "post", "json", data);
	}

	public editOriginalInteractionResponse(appID: string, token: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.editWebhookMessage(appID, token, "@original", data);
	}

	public deleteOriginalInteractionResponse(appID: string, token: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appID, token, "@original");
	}

	public createFollowupMessage(appID: string, token: string, data: Parameters<WebhookMethods["executeWebhook"]>[2] & { flags?: number }): Promise<void> {
		return this.webhooks.executeWebhook(appID, token, data);
	}

	public editFollowupMessage(appID: string, token: string, messageId: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.editWebhookMessage(appID, token, messageId, data);
	}

	public deleteFollowupMessage(appID: string, token: string, messageId: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appID, token, messageId);
	}

	public getGuildApplicationCommandPermissions(appID: string, guildID: string): Promise<Array<import("@amanda/discordtypings").GuildApplicationCommandPermissions>> {
		return this.requestHandler.request(Endpoints.GUILD_APPLICATION_COMMAND_PERMISSIONS(appID, guildID), "get", "json");
	}

	public getApplicationCommandPermissions(appID: string, guildID: string, cmdID: string): Promise<import("@amanda/discordtypings").GuildApplicationCommandPermissions> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND_PERMISSIONS(appID, guildID, cmdID), "get", "json");
	}

	public editApplicationCommandPermissions(appID: string, guildID: string, cmdID: string, permissions: Array<Exclude<import("@amanda/discordtypings").ApplicationCommandPermissions, "id">>) {
		const payload = {
			permissions: permissions
		};
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND_PERMISSIONS(appID, guildID, cmdID), "put", "json", payload);
	}

	public batchEditApplicationCommandPermissions(appID: string, guildID: string, permissions: Array<Pick<import("@amanda/discordtypings").GuildApplicationCommandPermissions, "id" | "permissions">>) {
		return this.requestHandler.request(Endpoints.GUILD_APPLICATION_COMMAND_PERMISSIONS(appID, guildID), "put", "json", permissions);
	}
}

export = InteractionMethods;

interface CommandData {
	name: string;
	description: string;
	options?: Array<import("@amanda/discordtypings").ApplicationCommandOption>;
	default_permission?: boolean;
}
