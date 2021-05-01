import Endpoints from "../Endpoints";

/**
 * Methods for interacting with invites
 */
class InviteMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Invite Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.invite.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get the invite data on an invite id
	 * @param inviteId Id of the invite
	 * @param withCounts When set to true you get an invite object with additional `approximate_presence_count` and `approximate_member_count` fields
	 * @returns [Invite Object](https://discord.com/developers/docs/resources/invite#invite-object)
	 */
	public async getInvite(inviteId: string, withCounts: boolean | undefined = false): Promise<any> {
		return this.requestHandler.request(Endpoints.INVITE(inviteId), "get", "json", {with_counts: withCounts});
	}

	/**
	 * Delete an invite
	 * @param inviteId
	 * @returns [Invite Object](https://discord.com/developers/docs/resources/invite#invite-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_CHANNELS    | always    |
	 */
	public async deleteInvite(inviteId: string): Promise<any> {
		return this.requestHandler.request(Endpoints.INVITE(inviteId), "delete", "json");
	}
}

/**
 * @typedef {object} Invite
 * @property {string} code - unique id code of the invite
 * @property {import("./Guilds").Guild} guild - partial guild object of the invite
 * @property {import("./Channels").Channel} channel - partial channel object of the invite
 * @property {import("./Users").User} [inviter] - creator of the invite
 * @property {number} [uses] - how often the invite was used
 * @property {number} [max_uses] - how often the invite can be used
 * @property {number} [max_age] - duration in seconds until the invite expires
 * @property {Boolean} [temporary] - if this invite only grants temporary membership
 * @property {Date} [created_at] - when the invite was created
 * @property {Boolean} [revoked] - if this invite has been revoked
 */


export = InviteMethods;
