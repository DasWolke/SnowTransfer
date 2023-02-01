import Endpoints = require("../Endpoints");

/**
 * Methods for interacting with slash command specific endpoints
 */
class InteractionMethods {
	public requestHandler: (typeof import("../RequestHandler"))["RequestHandler"]["prototype"];
	public webhooks: (typeof import("./Webhooks"))["WebhookMethods"]["prototype"];

	/**
	 * Create a new Interaction Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.interaction.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: InteractionMethods["requestHandler"], webhooks: InteractionMethods["webhooks"]) {
		this.requestHandler = requestHandler;
		this.webhooks = webhooks;
	}

	/**
	 * Fetch all global commands for your application
	 * @param appId The Id of the application
	 * @param withLocalizations Whether or not to include localizations
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) objects
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const commands = await client.interaction.getApplicationCommands("appId")
	 */
	public getApplicationCommands(appId: string, withLocalizations?: boolean): Promise<Array<import("discord-typings").FetchedApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "get", "json", withLocalizations !== undefined ? { with_localizations: withLocalizations } : undefined);
	}

	/**
	 * Create a new global command. New global commands will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.createApplicationCommand("appId", { name: "test", description: "testing 1, 2, 3" })
	 */
	public createApplicationCommand(appId: string, data: import("discord-typings").ApplicationCommandBase): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "post", "json", data);
	}

	/**
	 * Fetch a global command for your application
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.getApplicationCommand("appId", "cmdId")
	 */
	public getApplicationCommand(appId: string, cmdId: string): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "get", "json");
	}

	/**
	 * Edit a global command. Updates will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @param data The command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.editApplicationCommand("appId", "cmdId", { name: "cool", description: "tells you how cool you are" })
	 */
	public editApplicationCommand(appId: string, cmdId: string, data: Partial<import("discord-typings").ApplicationCommandBase>): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "patch", "json", data);
	}

	/**
	 * Deletes a global command
	 * @param appId The Id of the application
	 * @param cmdId The Id of the command
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.interaction.deleteApplicationCommand("appId", "cmdId")
	 */
	public deleteApplicationCommand(appId: string, cmdId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMAND(appId, cmdId), "delete", "json");
	}

	/**
	 * Takes a list of application commands, overwriting existing commands that are registered globally for this application.
	 * Updates will be available in all guilds after 1 hour
	 * @param appId The Id of the application
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) objects
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const commands = await client.interaction.bulkOverwriteApplicationCommands("appId", [{ name: "test", description: "testing 1, 2, 3" }])
	 */
	public bulkOverwriteApplicationCommands(appId: string, data: Array<import("discord-typings").ApplicationCommandBase>): Promise<Array<import("discord-typings").FetchedApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_COMMANDS(appId), "put", "json", data);
	}

	/**
	 * Fetch all of the guild commands for your application for a specific guild.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param withLocalizations Whether or not to include localizations
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) objects
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const commands = await client.interaction.getGuildCommands("appId", "guildId", true)
	 */
	public getGuildApplicationCommands(appId: string, guildId: string, withLocalizations?: boolean): Promise<Array<import("discord-typings").FetchedApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "get", "json", withLocalizations !== undefined ? { with_localizations: withLocalizations } : undefined);
	}

	/**
	 * Create a new guild command. New guild commands will be available in the guild immediately.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param data Command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.createGuildApplicationCommand("appId", "guildId", { name: "test", description: "testing 1, 2, 3" })
	 */
	public createGuildApplicationCommand(appId: string, guildId: string, data: import("discord-typings").ApplicationCommandBase): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "post", "json", data);
	}

	/**
	 * Fetch a guild command for your application
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.getGuildApplicationCommand("appId", "guildId", "cmdId")
	 */
	public getGuildApplicationCommand(appId: string, guildId: string, cmdId: string): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "get", "json");
	}

	/**
	 * Edit a guild command. Updates for guild commands will be available immediately.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @param data New command data
	 * @returns An [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const command = await client.interaction.editGuildApplicationCommand("appId", "guildId", "cmdId", { name: "coolest", description: "tells you that you are the coolest" })
	 */
	public editGuildApplicationCommand(appId: string, guildId: string, cmdId: string, data: Partial<import("discord-typings").ApplicationCommandBase>): Promise<import("discord-typings").FetchedApplicationCommand> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "patch", "json", data);
	}

	/**
	 * Delete a guild command
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.interaction.deleteGuildApplicationCommand("appId", "guildId", "cmdId")
	 */
	public deleteGuildApplicationCommand(appId: string, guildId: string, cmdId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND(appId, guildId, cmdId), "delete", "json");
	}

	/**
	 * Takes a list of application commands, overwriting existing commands for the guild
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param data Array of commands
	 * @returns An Array of [application command](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) objects
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const commands = await client.interaction.bulkOverwriteGuildApplicationCommands("appId", "guildId", [{ name: "test", description: "testing 1, 2, 3" }])
	 */
	public bulkOverwriteGuildApplicationCommands(appId: string, guildId: string, data: Array<import("discord-typings").ApplicationCommandBase>): Promise<Array<import("discord-typings").FetchedApplicationCommand>> {
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS(appId, guildId), "put", "json", data);
	}

	/**
	 * Fetches command permissions for all or a specific command for your application in a guild
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @returns An Array or single [guild application command permission](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-guild-application-command-permissions-structure) objects
	 *
	 * @example
	 * // Gets all commands' permissions
	 * const client = new SnowTransfer("TOKEN")
	 * const permissions = await client.interaction.getGuildApplicationCommandPermissions("appId", "guildId")
	 *
	 * @example
	 * // Gets a specific command's permissions
	 * const client = new SnowTransfer("TOKEN")
	 * const permissions = await client.interaction.getGuildApplicationCommandPermissions("appId", "guildId", "cmdId")
	 */
	public getGuildApplicationCommandPermissions(appId: string, guildId: string): Promise<Array<import("discord-typings").GuildApplicationCommandPermission>>;
	public getGuildApplicationCommandPermissions(appId: string, guildId: string, cmdId: string): Promise<import("discord-typings").GuildApplicationCommandPermission>;
	public getGuildApplicationCommandPermissions(appId: string, guildId: string, cmdId?: string): Promise<Array<import("discord-typings").GuildApplicationCommandPermission> | import("discord-typings").GuildApplicationCommandPermission> {
		if (cmdId) return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND_PERMISSIONS(appId, guildId, cmdId), "get", "json");
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMANDS_PERMISSIONS(appId, guildId), "get", "json");
	}

	/**
	 * Edits command permissions for a specific command for your application in a guild. You can only add up to 10 permission overwrites for a command.
	 * @param appId The Id of the application
	 * @param guildId The Id of the guild
	 * @param cmdId The Id of the command
	 * @param permissions New application command permissions data
	 * @returns A [guild application command permission](https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-guild-application-command-permissions-structure) object
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const permissions = await client.interaction.editGuildApplicationCommandPermissions("appId", "guildId", "cmdId", [{ type: 2, id: "userId", permission: true }])
	 */
	public editGuildApplicationCommandPermissions(appId: string, guildId: string, cmdId: string, permissions: Array<import("discord-typings").ApplicationCommandPermission>): Promise<import("discord-typings").GuildApplicationCommandPermission> {
		const payload = { permissions: permissions };
		return this.requestHandler.request(Endpoints.APPLICATION_GUILD_COMMAND_PERMISSIONS(appId, guildId, cmdId), "put", "json", payload);
	}

	/**
	 * Create a response to an Interaction
	 *
	 * When uploading attachments to respond to message interactions, you must provide the top level files property
	 * which needs to match attachments array length and each element needs to match the same indexes as where their filename is defined (the top level files property gets deleted before it's appended to payload_json).
	 * Should you have a more elegant solution, possibly rewriting the interface with the request handler, please submit a PR/issue.
	 * @param interactionId The Id of the interaction
	 * @param token The token of the interaction
	 * @param data Response data
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * // Respond to a message interaction
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * client.interaction.createInteractionResponse("interactionId", "token", { type: 4, data: { content: "Hello World" } })
	 */
	public createInteractionResponse(interactionId: string, token: string, data: import("discord-typings").InteractionResponse & { files?: Array<{ name: string; file: Buffer; }> }): Promise<void> {
		return this.requestHandler.request(Endpoints.INTERACTION_CALLBACK(interactionId, token), "post", data.files ? "multipart" : "json", data);
	}

	/**
	 * Returns the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * const message = await client.interaction.getOriginalInteractionResponse("appId", "token")
	 */
	public getOriginalInteractionResponse(appId: string, token: string): Promise<import("discord-typings").Message> {
		return this.webhooks.getWebhookMessage(appId, token, "@original");
	}

	/**
	 * Edits the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param data New response data
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * const message = await client.interaction.editOriginalInteractionResponse("appId", "token", { content: "The world said hello back" })
	 */
	public editOriginalInteractionResponse(appId: string, token: string, data: import("./Webhooks").WebhookEditMessageData): Promise<import("discord-typings").Message> {
		return this.webhooks.editWebhookMessage(appId, token, "@original", data);
	}

	/**
	 * Deletes the initial Interaction response
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * client.interaction.deleteOriginalInteractionResponse("appId", "token")
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
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * const message = await client.interaction.createFollowupMessage("appId", "token", { content: "The pacer gram fitness test-" })
	 */
	public createFollowupMessage(appId: string, token: string, data: Omit<import("./Webhooks").WebhookCreateMessageData, "avatar_url" | "username">): Promise<import("discord-typings").Message> {
		// wait is always true for interactions and should not be supplied as it will throw an error if the query string is present
		return this.webhooks.executeWebhook(appId, token, data) as unknown as Promise<import("discord-typings").Message>;
	}

	/**
	 * Get a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param messageId The Id of the message
	 * @returns A [message](https://discord.com/developers/docs/resources/channel#message-object) object
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * const message = await client.interaction.getFollowupMessage("appId", "token", "messageId")
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
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * const message = await client.interaction.editFollowupMessage("appId", "token", "messageId", { content: "-is a multistage aerobic capacity test" })
	 */
	public editFollowupMessage(appId: string, token: string, messageId: string, data: import("./Webhooks").WebhookEditMessageData): Promise<import("discord-typings").Message> {
		return this.webhooks.editWebhookMessage(appId, token, messageId, data);
	}

	/**
	 * Deletes a followup message for an Interaction
	 * @param appId The Id of the application
	 * @param token The token of the interaction
	 * @param messageId The Id of the message
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer() // This endpoint does not require a Bot token. The interaction token alone will suffice
	 * client.interaction.deleteFollowupMessage("appId", "token", "messageId")
	 */
	public deleteFollowupMessage(appId: string, token: string, messageId: string): Promise<void> {
		return this.webhooks.deleteWebhookMessage(appId, token, messageId);
	}
}

export = InteractionMethods;
