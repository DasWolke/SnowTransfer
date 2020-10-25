import DewCache from "./DewCache";

class UserCache extends DewCache {
	public user: import("../methods/Users")

	public constructor(user: import("../methods/Users")) {
		super();
		this.user = user;
	}

	public fetchUser(userID): Promise<import("@amanda/discordtypings").UserData> {
		if (this.has(userID)) {
			return Promise.resolve(this.get(userID));
		} else {
			return this.user.getUser(userID);
		}
	}
}

export = UserCache;
