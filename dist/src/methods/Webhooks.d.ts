/// <reference types="node" />
declare class WebhookMethods {
    requestHandler: import("../RequestHandler");
    disableEveryone: boolean;
    constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean);
    createWebhook(channelId: string, data: {
        name: string;
        avatar?: string;
    }): Promise<any>;
    getWebhooksChannel(channelId: string): Promise<Array<any>>;
    getWebhooksGuild(guildId: string): Promise<Array<any>>;
    getWebhook(webhookId: string, token?: string): Promise<any>;
    updateWebhook(webhookId: string, token: string, data: {
        name?: string;
        avatar?: string;
        channel_id?: string;
    }): Promise<object>;
    deleteWebhook(webhookId: string, token: string): Promise<void>;
    executeWebhook(webhookId: string, token: string, data?: WebhookCreateMessageData, options?: {
        disableEveryone?: boolean;
    }): Promise<void>;
    executeWebhookSlack(webhookId: string, token: string, data: any, options?: {
        disableEveryone?: boolean;
    }): Promise<void>;
}
interface WebhookCreateMessageData {
    content?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    tts?: boolean | null;
    file?: {
        name?: string;
        file: Buffer;
    };
    embeds?: Array<import("@amanda/discordtypings").EmbedData>;
}
export = WebhookMethods;
