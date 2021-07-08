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

	/**
	 * Fetch all global commands for your application
	 * @param appID The ID of the application
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public getApplicationCommands(appID: string): Promise<Array<import("@amanda/discordtypings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "get", "json");
	}

	/**
	 * Fetch a global command for your application
	 * @param appID The ID of the application
	 * @param cmdID The ID of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public getApplicationCommand(appID: string, cmdID: string): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "get", "json");
	}

	/**
	 * Create a new global command. New global commands will be available in all guilds after 1 hour
	 * @param appID The ID of the application
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public createApplicationCommand(appID: string, data: CommandData): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "post", "json", data);
	}

	/**
	 * Edit a global command. Updates will be available in all guilds after 1 hour
	 * @param appID The ID of the application
	 * @param cmdID The ID of the command
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public editApplicationCommand(appID: string, cmdID: string, data: Partial<CommandData>): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "patch", "json", data);
	}

	/**
	 * Takes a list of application commands, overwriting existing commands that are registered globally for this application.
	 * Updates will be available in all guilds after 1 hour
	 * @param appID The ID of the application
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public bulkOverwriteApplicationCommands(appID, data: Array<CommandData>): Promise<Array<import("@amanda/discordtypings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appID), "put", "json", data);
	}

	/**
	 * Deletes a global command
	 * @param appID The ID of the application
	 * @param cmdID The ID of the command
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteApplicationCommand(appID: string, cmdID: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appID, cmdID), "delete", "json");
	}

	/**
	 * Fetch all of the guild commands for your application for a specific guild.
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public getGuildApplicationCommands(appID: string, guildID: string): Promise<Array<import("@amanda/discordtypings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "get", "json");
	}

	/**
	 * Fetch a guild command for your application
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param cmdID The ID of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public getGuildApplicationCommand(appID: string, guildID: string, cmdID: string): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "get", "json");
	}

	/**
	 * Create a new guild command. New guild commands will be available in the guild immediately.
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param data Command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public createGuildApplicationCommand(appID: string, guildID: string, data: CommandData): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "post", "json", data);
	}

	/**
	 * Edit a guild command. Updates for guild commands will be available immediately.
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param cmdID The ID of the command
	 * @param data New command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public editGuildApplicationCommand(appID: string, guildID: string, cmdID: string, data: Partial<CommandData>): Promise<import("@amanda/discordtypings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "patch", "json", data);
	}

	/**
	 * Takes a list of application commands, overwriting existing commands for the guild
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public bulkOverwriteGuildApplicationCommand(appID: string, guildID: string, data: Array<CommandData>): Promise<Array<import("@amanda/discordtypings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appID, guildID), "put", "json", data);
	}

	/**
	 * Delete a guild command
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param cmdID The ID of the command
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteGuildApplicationCommand(appID: string, guildID: string, cmdID: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appID, guildID, cmdID), "delete", "json");
	}

	/**
	 * Returns the initial Interaction response
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @returns A [message]() object
	 */
	public getOriginalInteractionResponse(appID: string, token: string): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.getWebhookMessage(appID, token, "@original");
	}

	/**
	 * Create a response to an Interaction
	 * @param interactionID The ID of the interaction
	 * @param token The token of the interaction
	 * @param data Response data
	 * @returns Resolves the Promise on successful execution
	 */
	public createInteractionResponse(interactionID: string, token: string, data: import("@amanda/discordtypings").InteractionResponseData): Promise<void> {
		return this.requestHandler.request(Endpoints.INTERACTION_CALLBACK(interactionID, token), "post", "json", data);
	}

	/**
	 * Edits the initial Interaction response
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @param data New response data
	 * @returns A [message]() object
	 */
	public editOriginalInteractionResponse(appID: string, token: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.editWebhookMessage(appID, token, "@original", data);
	}

	/**
	 * Deletes the initial Interaction response
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteOriginalInteractionResponse(appID: string, token: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appID, token, "@original");
	}

	/**
	 * Create a followup message for an Interaction
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @param data Message data
	 * @returns A [message](object)
	 */
	public createFollowupMessage(appID: string, token: string, data: Parameters<WebhookMethods["executeWebhook"]>[2] & { flags?: number }): Promise<import("@amanda/discordtypings").MessageData> {
		// @ts-ignore
		return this.webhooks.executeWebhook(appID, token, data);
	}

	/**
	 * Edits a followup message for an Interaction
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @param messageId The ID of the message
	 * @param data The new message data
	 * @returns A [message](object)
	 */
	public editFollowupMessage(appID: string, token: string, messageId: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("@amanda/discordtypings").MessageData> {
		return this.webhooks.editWebhookMessage(appID, token, messageId, data);
	}

	/**
	 * Deletes a followup message for an Interaction
	 * @param appID The ID of the application
	 * @param token The token of the interaction
	 * @param messageId The ID of the message
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteFollowupMessage(appID: string, token: string, messageId: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appID, token, messageId);
	}

	/**
	 * Fetches command permissions for all commands for your application in a guild
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @returns An Array of [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects
	 */
	public getGuildApplicationCommandPermissions(appID: string, guildID: string): Promise<Array<import("@amanda/discordtypings").GuildApplicationCommandPermissions>> {
		return this.requestHandler.request(Endpoints.GUILD_APPLICATION_COMMAND_PERMISSIONS(appID, guildID), "get", "json");
	}

	/**
	 * Fetches command permissions for a specific command for your application in a guild
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param cmdID The ID of the command
	 * @returns A [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) object
	 */
	public getApplicationCommandPermissions(appID: string, guildID: string, cmdID: string): Promise<import("@amanda/discordtypings").GuildApplicationCommandPermissions> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND_PERMISSIONS(appID, guildID, cmdID), "get", "json");
	}

	/**
	 * Edits command permissions for a specific command for your application in a guild. You can only add up to 10 permission overwrites for a command.
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param cmdID The ID of the command
	 * @param permissions New application command permissions data
	 * @returns A [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) object
	 */
	public editApplicationCommandPermissions(appID: string, guildID: string, cmdID: string, permissions: Array<Exclude<import("@amanda/discordtypings").ApplicationCommandPermissions, "id">>): Promise<import("@amanda/discordtypings").GuildApplicationCommandPermissions> {
		const payload = {
			permissions: permissions
		};
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND_PERMISSIONS(appID, guildID, cmdID), "put", "json", payload);
	}

	/**
	 * Batch edits permissions for all commands in a guild. Takes an Array of partial [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects.
	 * You can only add up to 10 permission overwrites for a command
	 * @param appID The ID of the application
	 * @param guildID The ID of the guild
	 * @param permissions New application command permissions data Array
	 * @returns An Array of [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects
	 */
	public batchEditApplicationCommandPermissions(appID: string, guildID: string, permissions: Array<Pick<import("@amanda/discordtypings").GuildApplicationCommandPermissions, "id" | "permissions">>): Promise<Array<import("@amanda/discordtypings").GuildApplicationCommandPermissions>> {
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
