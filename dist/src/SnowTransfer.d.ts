import Ratelimiter from "./Ratelimiter";
import RequestHandler from "./RequestHandler";
import ChannelMethods from "./methods/Channels";
import UserMethods from "./methods/Users";
import EmojiMethods from "./methods/Emojis";
import WebhookMethods from "./methods/Webhooks";
import GuildMethods from "./methods/Guilds";
import InviteMethods from "./methods/Invites";
import VoiceMethods from "./methods/Voices";
import BotMethods from "./methods/Bots";
import AuditLogMethods from "./methods/AuditLog";
declare class SnowTransfer {
    options: {
        baseHost: string;
        disableEveryone: boolean;
        sentryOptions: {
            extra: {
                snowtransferVersion: string;
            };
        };
        useRedis: boolean;
    };
    token: string;
    channel: ChannelMethods;
    requestHandler: RequestHandler;
    user: UserMethods;
    emoji: EmojiMethods;
    webhook: WebhookMethods;
    guild: GuildMethods;
    invite: InviteMethods;
    voice: VoiceMethods;
    bot: BotMethods;
    auditLog: AuditLogMethods;
    ratelimiter: Ratelimiter;
    constructor(token: string, options?: {
        baseHost?: string;
        disableEveryone?: boolean;
    });
}
export = SnowTransfer;
