const DewCache = require("./DewCache")

class UserCache extends DewCache {
	/**
	 * @param {import("../methods/Users")} user
	 */
	constructor(user) {
		super()
		this.user = user
	}

	/**
	 * @returns {Promise<import("../methods/Users").User>}
	 */
	fetchUser(userID) {
		if (this.has(userID)) {
			return Promise.resolve(this.get(userID))
		} else {
			return this.user.getUser(userID)
		}
	}
}

module.exports = UserCache
