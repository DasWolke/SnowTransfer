import Endpoints from "../Endpoints";

/**
 * Methods for handling webhook interactions
 */
class WebhookMethods {
	public requestHandler: import("../RequestHandler");
	public disableEveryone: boolean;

	/**
	 * Create a new Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.webhook.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 * @param disableEveryone Disable [at]everyone/[at]here on outgoing messages
	 */
	public constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean) {
		this.requestHandler = requestHandler;
		this.disableEveryone = disableEveryone;
	}

	/**
	 * Create a new Webhook
	 * @param channelId - Id of the channel
	 * @param data Object with webhook properties
	 * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Create a new Webhook with the name "Webby Webhook"
	 * let client = new SnowTransfer('TOKEN');
	 * let webhookData = {
	 *   name: "Webby Webhook"
	 * }
	 * client.webhook.createWebhook('channel Id', webhookData);
	 */
	public async createWebhook(channelId: string, data: { name: string; avatar?: string; }): Promise<import("@amanda/discordtypings").WebhookData> {
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), "post", "json", data);
	}

	/**
	 * Get webhooks created within a channel
	 * @param channelId - Id of the channel
	 * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Get all webhooks within a channel
	 * let client = new SnowTransfer('TOKEN');
	 * client.webhook.getWebhooksChannel('channel Id').then(console.log);
	 */
	public async getWebhooksChannel(channelId: string): Promise<Array<import("@amanda/discordtypings").WebhookData>> {
		return this.requestHandler.request(Endpoints.CHANNEL_WEBHOOKS(channelId), "get", "json");
	}

	/**
	 * Get all webhooks within a guild
	 * @param guildId Id of the guild
	 * @returns Array of [Webhook Objects](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_WEBHOOKS    | always    |
	 *
	 * @example
	 * // Get all webhooks within a guild
	 * let client = new SnowTransfer('TOKEN');
	 * client.webhook.getWebhooksGuild('guild Id').then(console.log);
	 */
	public async getWebhooksGuild(guildId: string): Promise<Array<import("@amanda/discordtypings").WebhookData>> {
		return this.requestHandler.request(Endpoints.GUILD_WEBHOOKS(guildId), "get", "json");
	}

	/**
	 * Get a single Webhook via Id
	 * @param webhookId Id of the webhook
	 * @param token Webhook token
	 * @returns [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 *
	 * @example
	 * // Get a webhook via Id
	 * let client = new SnowTransfer('TOKEN');
	 * client.webhook.getWebhook('webhook Id', 'webhook token').then(console.log);
	 */
	public async getWebhook(webhookId: string, token?: string): Promise<import("@amanda/discordtypings").WebhookData> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "get", "json");
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "get", "json");
	}

	/**
	 * Update a webhook
	 * @param webhookId Id of the webhook
	 * @param token Webhook token
	 * @param data Updated Webhook properties
	 * @returns Updated [Webhook Object](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 *
	 * @example
	 * // Rename a webhook to "Captain Hook"
	 * let client = new SnowTransfer('TOKEN');
	 * let webhookData = {
	 *   name: 'Captain Hook'
	 * }
	 * client.webhook.updateWebhook('webhook Id', 'webhook token', webhookData);
	 */
	public async updateWebhook(webhookId: string, token: string | undefined, data: { name?: string; avatar?: string; channel_id?: string; }): Promise<import("@amanda/discordtypings").WebhookData> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "patch", "json", data);
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "patch", "json", data);
	}

	/**
	 * Delete a Webhook
	 * @param webhookId Id of the webhook
	 * @param token Webhook token
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition     |
	 * |--------------------|---------------|
	 * | MANAGE_WEBHOOKS    | without token |
	 */
	public async deleteWebhook(webhookId: string, token?: string): Promise<void> {
		if (token) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token), "delete", "json");
		return this.requestHandler.request(Endpoints.WEBHOOK(webhookId), "delete", "json");
	}

	/**
	 * Send a message via Webhook
	 * @param webhookId Id of the webhook
	 * @param token webhook token
	 * @param data Webhook data to send
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * // Send a message saying "Hi from my webhook" with a previously created webhook
	 * let client = new SnowTransfer('TOKEN');
	 * client.webhook.executeWebhook('webhook Id', 'webhook token', {content: 'Hi from my webhook'})
	 */
	public async executeWebhook(webhookId: string, token: string, data: WebhookCreateMessageData, options: { wait?: boolean; disableEveryone?: boolean } = { wait: false, disableEveryone: this.disableEveryone }): Promise<void> {
		if (typeof data !== "string" && !data?.content && !data?.embeds && !data?.files) {
			throw new Error("Missing content or embeds or files");
		}
		if (typeof data === "string") {
			data = { content: data };
		}

		// Sanitize the message
		if (data.content && (options?.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
			data.content = data.content.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
		}

		if (data.files) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token) + options?.wait ? "?wait=true" : "", "post", "multipart", data);
		else return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN(webhookId, token) + options?.wait ? "?wait=true" : "", "post", "json", data);
	}

	/**
	 * Execute a slack style Webhook
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param data Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
	 * @param options Options for disabling everyone/here pings or setting the wait query string
	 * @returns Resolves the Promise on successful execution
	 */
	public async executeWebhookSlack(webhookId: string, token: string, data: any, options: { wait?: boolean; disableEveryone?: boolean } = { wait: false, disableEveryone: this.disableEveryone }): Promise<void> {
		// Sanitize the message
		if (data.text && (options?.disableEveryone !== undefined ? options.disableEveryone : this.disableEveryone)) {
			data.text = data.text.replace(/@([^<>@ ]*)/gsmu, replaceEveryone);
		}

		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_SLACK(webhookId, token) + options?.wait ? "?wait=true" : "", "post", "json", data);
	}

	/**
	 * Executes a github style Webhook
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param data Check [GitHub's documentation](https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#webhook-payload-object)
	 * @param options Options for disabling everyone/here pings or setting the wait query string
	 * @returns Resolves the Promise on successful execution
	 */
	public async executeWebhookGitHub(webhookId: string, token: string, data: GitHubWebhookData, options: { wait?: boolean } = { wait: false }): Promise<void> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_GITHUB(webhookId, token) + options?.wait ? "?wait=true" : "", "post", "json", data);
	}

	/**
	 * Get a single message from a specific Webhook via Id
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public async getWebhookMessage(webhookId: string, token: string, messageId: string): Promise<import("@amanda/discordtypings").MessageData> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), "get", "json");
	}

	/**
	 * Edit a message sent by a Webhook
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @param data Data to send
	 * @returns [discord message](https://discord.com/developers/docs/resources/channel#message-object) object
	 */
	public async editWebhookMessage(webhookId: string, token: string, messageId: string, data: WebhookEditMessageData): Promise<import("@amanda/discordtypings").MessageData> {
		if (data.files) return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), "patch", "multipart", data);
		else return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), "patch", "json", data);
	}

	/**
	 * Delete a message sent by a Webhook
	 * @param webhookId Id of the Webhook
	 * @param token Webhook token
	 * @param messageId Id of the message
	 * @returns Resolves the Promise on successful execution
	 */
	public async deleteWebhookMessage(webhookId: string, token: string, messageId: string): Promise<void> {
		return this.requestHandler.request(Endpoints.WEBHOOK_TOKEN_MESSAGE(webhookId, token, messageId), "delete", "json");
	}
}

function replaceEveryone(match: string, target: string) {
	if (target.match(/^[&!]?\d+$/)) {
		return `@${target}`;
	} else {
		return `@\u200b${target}`;
	}
}

/**
 * Data from https://docs.github.com/en/developers/webhooks-and-events/webhook-events-and-payloads#webhook-payload-object
 */
interface GitHubWebhookData {
	action: "created" | "completed" | "rerequested" | "requested_action";
	/**
	 * https://docs.github.com/en/rest/reference/checks#get-a-check-run
	 */
	check_run?: any;
	requested_action?: {
		identifier: string;
	};
	/**
	 * https://docs.github.com/en/rest/reference/repos#get-a-repository
	 */
	repository: any;
	/**
	 * https://docs.github.com/en/rest/reference/orgs#get-an-organization
	 */
	organization?: any;
	installation?: any;
	sender: any;
}

interface WebhookCreateMessageData {
	/**
	 * content of the message
	 */
	content?: string | null;
	/**
	 * username to use for the webhook
	 */
	username?: string | null;
	/**
	 * avatar url of the webhook
	 */
	avatar_url?: string | null;
	/**
	 * send a text to speech message
	 */
	tts?: boolean | null;
	/**
	 * Files that should be uploaded
	 */
	files?: Array<{
		/**
		 * Name of the file
		 */
		name: string;
		/**
		 * Buffer with file contents
		 */
		file: Buffer;
	}>;
	/**
	 * Array of [embed objects](https://discord.com/developers/docs/resources/channel#embed-object)
	 */
	embeds?: Array<import("@amanda/discordtypings").EmbedData>;
	/**
	 * [alowed mentions object](https://discord.com/developers/docs/resources/channel#allowed-mentions-object)
	 */
	allowed_mentions?: import("@amanda/discordtypings").AllowedMentionsData;
	/**
	 * [Buttons](https://discord.com/developers/docs/interactions/message-components#component-object) to add to the message
	 */
	components?: Array<import("@amanda/discordtypings").MessageComponentData>;
}

interface WebhookEditMessageData {
	/**
	 * content of the message
	 */
	content?: string | null;
	/**
	 * Array of [embed objects](https://discord.com/developers/docs/resources/channel#embed-object)
	 */
	embeds?: Array<import("@amanda/discordtypings").EmbedData> | null;
	/**
	 * Files that should be updated
	 */
	files?: Array<{
		/**
		 * Name of the file
		 */
		name: string;
		/**
		 * Buffer with file contents
		 */
		file: Buffer;
	}>;
	/**
	 * [alowed mentions object](https://discord.com/developers/docs/resources/channel#allowed-mentions-object)
	 */
	allowed_mentions?: import("@amanda/discordtypings").AllowedMentionsData | null;
	attachments?: Array<import("@amanda/discordtypings").AttachmentData> | null;
	/**
	 * [Buttons](https://discord.com/developers/docs/interactions/message-components#component-object) to add to the message
	 */
	components?: Array<import("@amanda/discordtypings").MessageComponentData>;
}

export = WebhookMethods;
