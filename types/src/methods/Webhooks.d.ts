/// <reference types="node" />
import RequestHandler from "../RequestHandler";
import { TWebhook } from "../LibTypes";
/**
 * Methods for handling webhook interactiong
 */
declare class WebhookMethods {
    private requestHandler;
    /**
     * Create a new Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.webhook.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Create a new Webhook
     * @param {String} channelId - Id of the channel
     * @param {Object} data - Object with webhook properties
     * @param {String} data.name - name of the webhook
     * @param {String} [data.avatar] - base 64 encoded avatar
     * @returns {Promise.<Object>} [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_WEBHOOKS    | always    |
     *
     * @example
     * // Create a new Webhook with the name "Webby Webhook"
     * let client = new SnowTransfer('TOKEN');
     * let webhookData = {
     *   name: "Webby Webhook"
     * }
     * client.webhook.createWebhook('channel Id', webhookData)
     */
    createWebhook(channelId: string, data: {
        name: string;
        avatar?: string;
    }): Promise<TWebhook>;
    /**
     * Get webhooks created within a channel
     * @param {String} channelId - Id of the channel
     * @returns {Promise.<Object[]>} Array of [Webhook Objects](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_WEBHOOKS    | always    |
     */
    getWebhooksChannel(channelId: string): Promise<TWebhook[]>;
    /**
     * Get all webhooks within a guild
     * @param {String} guildId - Id of the guild
     * @returns {Promise.<Object>} Array of [Webhook Objects](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_WEBHOOKS    | always    |
     */
    getWebhooksGuild(guildId: string): Promise<TWebhook>;
    /**
     * Get a single Webhook via Id
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @returns {Promise.<Object>} [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    getWebhook(webhookId: string, token?: string): Promise<TWebhook>;
    /**
     * Update a webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @param {Object} data - Updated Webhook properties
     * @param {String} [data.name] - New default name of the webhook
     * @param {String} [data.avatar] - Updated base 64 image for the default avatar
     * @param {String} [data.channel_id] - Id of the new channel of the webhook
     * @returns {Promise.<Object>} Updated [Webhook Object](https://discordapp.com/developers/docs/resources/webhook#webhook-object-webhook-structure)
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    updateWebhook(webhookId: string, token: string | undefined, data: {
        name?: string;
        avatar?: string;
        channel_id?: string;
    }): Promise<TWebhook>;
    /**
     * Delete a Webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} [token] - Webhook token
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     *
     * | Permissions needed | condition |
     |--------------------|---------------:|
     | MANAGE_WEBHOOKS    | without token |
     */
    deleteWebhook(webhookId: string, token?: string): Promise<void>;
    /**
     * Send a message via Webhook
     * @param {String} webhookId - Id of the webhook
     * @param {String} token - webhook token
     * @param {Object} data - Webhook data to send
     * @param {String} [data.content] - content of the message
     * @param {?String} [data.username] - username to use for the webhook
     * @param {?String} [data.avatar_url] - avatar url of the webhook
     * @param {?Boolean} [data.tts] - send a text to speech message
     * @param {Object} [data.file] - File, that should be uploaded
     * @param {String} [data.file.name] - Name of the file
     * @param {File} [data.file.file] - Buffer with file contents
     * @param {Object[]} [data.embeds] - Array of [embed objects](https://discordapp.com/developers/docs/resources/channel#embed-object)
     * @returns {Promise.<void>} Resolves the Promise on successful execution
     * @example
     * // Send a message saying "Hi from my webhook" with a previously created webhook
     * let client = new SnowTransfer('TOKEN');
     * client.webhook.executeWebhook('webhook Id', 'webhook token', {content: 'Hi from my webhook'})
     */
    executeWebhook(webhookId: string, token: string, data: {
        content?: string;
        username?: string;
        avatar_url?: string;
        tts?: string;
        file?: {
            name: string;
            file: Buffer;
        };
        embeds: Object[];
    }): Promise<void>;
    /**
     * Execute a slack style Webhook
     * @param {String} webhookId - Id of the Webhook
     * @param {String} token - Webhook token
     * @param {Object} data - Check [Slack's documentation](https://api.slack.com/incoming-webhooks)
     * @returns {Promise<void>} Resolves the Promise on successful execution
     */
    executeWebhookSlack(webhookId: string, token: string, data: Object): Promise<void>;
}
export default WebhookMethods;
//# sourceMappingURL=Webhooks.d.ts.map