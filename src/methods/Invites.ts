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
	public async getInvite(inviteId: string, options?: { with_counts?: boolean; with_expiration?: boolean; }): Promise<import("discord-typings").InviteData> {
		return this.requestHandler.request(Endpoints.INVITE(inviteId), "get", "json", options);
	}

	/**
	 * Delete an invite
	 * @param inviteId
	 * @returns [Invite Object](https://discord.com/developers/docs/resources/invite#invite-object)
	 *
	 * | Permissions needed | Condition                                     |
	 * |--------------------|-----------------------------------------------|
	 * | MANAGE_CHANNELS    | for invite that belongs to a specific channel |
	 * | MANAGE_GUILD       | delete any invite guild wide                  |
	 */
	public async deleteInvite(inviteId: string): Promise<import("discord-typings").InviteData>  {
		return this.requestHandler.request(Endpoints.INVITE(inviteId), "delete", "json");
	}
}

export = InviteMethods;
