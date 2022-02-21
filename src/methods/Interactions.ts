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
	 * @param appId The Id of the application
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public getApplicationCommands(appId: string): Promise<Array<import("discord-typings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "get", "json");
	}

	/**
	 * Fetch a global command for your application
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public getApplicationCommand(appId: string, cmdId: string): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "get", "json");
	}

	/**
	 * Create a new global command. New global commands will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public createApplicationCommand(appId: string, data: CommandData & { type?: import("discord-typings").ApplicationCommandType; }): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "post", "json", data);
	}

	/**
	 * Edit a global command. Updates will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public editApplicationCommand(appId: string, cmdId: string, data: Partial<CommandData>): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "patch", "json", data);
	}

	/**
	 * Takes a list of application commands, overwriting existing commands that are registered globally for this application.
	 * Updates will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public bulkOverwriteApplicationCommands(appId, data: Array<CommandData & { type?: import("discord-typings").ApplicationCommandType; }>): Promise<Array<import("discord-typings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "put", "json", data);
	}

	/**
	 * Deletes a global command
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteApplicationCommand(appId: string, cmdId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "delete", "json");
	}

	/**
	 * Fetch all of the guild commands for your application for a specific guild.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public getGuildApplicationCommands(appId: string, guildId: string): Promise<Array<import("discord-typings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "get", "json");
	}

	/**
	 * Fetch a guild command for your application
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public getGuildApplicationCommand(appId: string, guildId: string, cmdId: string): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "get", "json");
	}

	/**
	 * Create a new guild command. New guild commands will be available in the guild immediately.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param data Command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public createGuildApplicationCommand(appId: string, guildId: string, data: CommandData & { type?: import("discord-typings").ApplicationCommandType; }): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "post", "json", data);
	}

	/**
	 * Edit a guild command. Updates for guild commands will be available immediately.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @param data New command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) object
	 */
	public editGuildApplicationCommand(appId: string, guildId: string, cmdId: string, data: Partial<CommandData>): Promise<import("discord-typings").ApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "patch", "json", data);
	}

	/**
	 * Takes a list of application commands, overwriting existing commands for the guild
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object) objects
	 */
	public bulkOverwriteGuildApplicationCommand(appId: string, guildId: string, data: Array<CommandData & { type?: import("discord-typings").ApplicationCommandType; }>): Promise<Array<import("discord-typings").ApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "put", "json", data);
	}

	/**
	 * Delete a guild command
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteGuildApplicationCommand(appId: string, guildId: string, cmdId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "delete", "json");
	}

	/**
	 * Returns the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public getOriginalInteractionResponse(appId: string, token: string): Promise<import("discord-typings").Message> {
		return this.webhooks.getWebhookMessage(appId, token, "@original");
	}

	/**
	 * Create a response to an Interaction
	 * @param interactionId The Id of the interaction
	 * @param token The token of the interaction
	 * @param data Response data
	 * @returns Resolves the Promise on successful execution
	 */
	public createInteractionResponse(interactionId: string, token: string, data: import("discord-typings").InteractionResponse): Promise<void> {
		return this.requestHandler.request(Endpoints.INTERACTION_CALLBACK(interactionId, token), "post", "json", data);
	}

	/**
	 * Edits the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param data New response data
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public editOriginalInteractionResponse(appId: string, token: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("discord-typings").Message> {
		return this.webhooks.editWebhookMessage(appId, token, "@original", data);
	}

	/**
	 * Deletes the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteOriginalInteractionResponse(appId: string, token: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appId, token, "@original");
	}

	/**
	 * Create a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param data Message data
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public createFollowupMessage(appId: string, token: string, data: Parameters<WebhookMethods["executeWebhook"]>[2] & { flags?: number; }): Promise<import("discord-typings").Message> {
		// wait is always true for interactions
		return this.webhooks.executeWebhook(appId, token, data) as unknown as Promise<import("discord-typings").Message>;
	}

	/**
	 * Get a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param messageId The Id of the message
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public getFollowupMessage(appId: string, token: string, messageId: string) {
		return this.webhooks.getWebhookMessage(appId, token, messageId);
	}

	/**
	 * Edits a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param messageId The Id of the message
	 * @param data The new message data
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public editFollowupMessage(appId: string, token: string, messageId: string, data: Parameters<WebhookMethods["editWebhookMessage"]>[3]): Promise<import("discord-typings").Message> {
		return this.webhooks.editWebhookMessage(appId, token, messageId, data);
	}

	/**
	 * Deletes a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param messageId The Id of the message
	 * @returns Resolves the Promise on successful execution
	 */
	public deleteFollowupMessage(appId: string, token: string, messageId: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appId, token, messageId);
	}

	/**
	 * Fetches command permissions for all commands for your application in a guild
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @returns An Array of [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects
	 */
	public getGuildApplicationCommandsPermissions(appId: string, guildId: string): Promise<Array<import("discord-typings").GuildApplicationCommandPermission>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS_PERMISSIONS(appId, guildId), "get", "json");
	}

	/**
	 * Fetches command permissions for a specific command for your application in a guild
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns A [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) object
	 */
	public getGuildApplicationCommandPermissions(appId: string, guildId: string, cmdId: string): Promise<import("discord-typings").GuildApplicationCommandPermission> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND_PERMISSIONS(appId, guildId, cmdId), "get", "json");
	}

	/**
	 * Edits command permissions for a specific command for your application in a guild. You can only add up to 10 permission overwrites for a command.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @param permissions New application command permissions data
	 * @returns A [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) object
	 */
	public editGuildApplicationCommandPermissions(appId: string, guildId: string, cmdId: string, permissions: Array<Exclude<import("discord-typings").ApplicationCommandPermissions, "id">>): Promise<import("discord-typings").GuildApplicationCommandPermission> {
		const payload = {
			permissions: permissions
		};
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND_PERMISSIONS(appId, guildId, cmdId), "put", "json", payload);
	}

	/**
	 * Batch edits permissions for all commands in a guild. Takes an Array of partial [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects.
	 * You can only add up to 10 permission overwrites for a command
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param permissions New application command permissions data Array
	 * @returns An Array of [guild application command permission](https://discord.com/developers/docs/interactions/slash-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects
	 */
	public batchEditApplicationCommandPermissions(appId: string, guildId: string, permissions: Array<Pick<import("discord-typings").GuildApplicationCommandPermission, "id" | "permissions">>): Promise<Array<import("discord-typings").GuildApplicationCommandPermission>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS_PERMISSIONS(appId, guildId), "put", "json", permissions);
	}
}

export = InteractionMethods;

interface CommandData {
	name: string;
	description: string;
	options?: Array<import("discord-typings").ApplicationCommandOption>;
	default_permission?: boolean;
}
