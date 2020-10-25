import DewCache from "./DewCache";
declare class UserCache extends DewCache {
    user: import("../methods/Users");
    constructor(user: import("../methods/Users"));
    fetchUser(userID: string): Promise<import("@amanda/discordtypings").UserData>;
}
export = UserCache;
