import UserCache from "../cache/UserCache";
import DT from "@amanda/discordtypings";
declare class UserMethods {
    requestHandler: import("../RequestHandler");
    cache: UserCache;
    constructor(requestHandler: import("../RequestHandler"));
    getSelf(): Promise<SelfUser>;
    getUser(userId: string): Promise<DT.UserData>;
    updateSelf(data: {
        username?: string;
        avatar?: string;
    }): Promise<SelfUser>;
    getGuilds(): Promise<Array<DT.GuildData>>;
    leaveGuild(guildId: string): Promise<void>;
    getDirectMessages(): Promise<Array<DT.DMChannelData>>;
    createDirectMessageChannel(userId: string): Promise<DT.DMChannelData>;
}
interface SelfUser extends DT.UserData {
    mfa_enabled: boolean;
    verified: boolean;
    email: string;
}
export = UserMethods;
