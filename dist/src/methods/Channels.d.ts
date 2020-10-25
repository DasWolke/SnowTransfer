/// <reference types="node" />
declare class ChannelMethods {
    requestHandler: import("../RequestHandler");
    disableEveryone: boolean;
    constructor(requestHandler: import("../RequestHandler"), disableEveryone: boolean);
    getChannel(channelId: string): Promise<import("@amanda/discordtypings").ChannelData>;
    updateChannel(channelId: string, data: EditChannelData): Promise<import("@amanda/discordtypings").ChannelData>;
    deleteChannel(channelId: string): Promise<import("@amanda/discordtypings").ChannelData>;
    getChannelMessages(channelId: string, options?: GetMessageOptions): Promise<Array<import("@amanda/discordtypings").MessageData>>;
    getChannelMessage(channelId: string, messageId: string): Promise<import("@amanda/discordtypings").MessageData>;
    createMessage(channelId: string, data: string | CreateMessageData, options?: {
        disableEveryone?: boolean;
    }): Promise<import("@amanda/discordtypings").MessageData>;
    editMessage(channelId: string, messageId: string, data: string | EditMessageData, options?: {
        disableEveryone?: boolean;
    }): Promise<import("@amanda/discordtypings").MessageData>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
    bulkDeleteMessages(channelId: string, messages: Array<string>): Promise<void>;
    createReaction(channelId: string, messageId: string, emoji: string): Promise<void>;
    deleteReactionSelf(channelId: string, messageId: string, emoji: string): Promise<void>;
    deleteReaction(channelId: string, messageId: string, emoji: string, userId: string): Promise<void>;
    getReactions(channelId: string, messageId: string, emoji: string): Promise<Array<import("@amanda/discordtypings").UserData>>;
    deleteAllReactions(channelId: string, messageId: string): Promise<void>;
    editChannelPermission(channelId: string, permissionId: string, data: any): Promise<void>;
    deleteChannelPermission(channelId: string, permissionId: string): Promise<void>;
    getChannelInvites(channelId: string): Promise<Array<any>>;
    createChannelInvite(channelId: string, data?: CreateInviteData): Promise<any>;
    startChannelTyping(channelId: string): Promise<void>;
    getChannelPinnedMessages(channelId: string): Promise<Array<import("@amanda/discordtypings").MessageData>>;
    addChannelPinnedMessage(channelId: string, messageId: string): Promise<void>;
    removeChannelPinnedMessage(channelId: string, messageId: string): Promise<void>;
    addDmChannelRecipient(channelId: string, userId: string, data: {
        access_token: string;
        nick?: string;
    }): Promise<void>;
    removeDmChannelRecipient(channelId: string, userId: string): Promise<void>;
}
interface EditChannelData {
    name?: string;
    position?: number;
    topic?: string;
    nsfw?: boolean;
    bitrate?: number;
    user_limit?: number;
    permission_overwrites?: Array<import("@amanda/discordtypings").PermissionOverwriteData>;
    parent_id?: string;
}
interface GetMessageOptions {
    around?: string;
    before?: string;
    after?: string;
    limit?: number;
}
interface CreateMessageData {
    embed?: import("@amanda/discordtypings").EmbedData;
    content?: string | null;
    tts?: boolean | null;
    file?: {
        name?: string;
        file: Buffer;
    };
}
interface EditMessageData {
    content?: string | null;
    embed?: import("@amanda/discordtypings").EmbedData;
}
interface CreateInviteData {
    max_age?: number;
    max_uses?: number;
    temporary?: boolean;
    unique?: boolean;
}
export = ChannelMethods;
