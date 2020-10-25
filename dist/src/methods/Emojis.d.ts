declare class EmojiMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    getEmojis(guildId: string): Promise<Array<import("@amanda/discordtypings").EmojiData>>;
    getEmoji(guildId: string, emojiId: string): Promise<import("@amanda/discordtypings").EmojiData>;
    createEmoji(guildId: string, data: CreateEmojiData): Promise<import("@amanda/discordtypings").EmojiData>;
    updateEmoji(guildId: string, emojiId: string, data: {
        name: string;
    }): Promise<import("@amanda/discordtypings").EmojiData>;
    deleteEmoji(guildId: string, emojiId: string): Promise<void>;
}
interface CreateEmojiData {
    name: string;
    image: string;
}
export = EmojiMethods;
