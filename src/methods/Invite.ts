import Endpoints = require("../Endpoints");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIInviteResult,
	RESTGetAPIInviteQuery,
	RESTGetAPIInviteResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with invites
 * @since 0.1.0
 */
class InviteMethods {
	/**
	 * Create a new Invite Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.invite.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get the invite data on an invite id
	 * @since 0.1.0
	 * @param inviteId Id of the invite
	 * @param options Query params for additional metadata fields
	 * @returns [Invite Object](https://discord.com/developers/docs/resources/invite#invite-object)
	 *
	 * @example
	 * // Gets an invite with approximate_member_count and approximate_presence_count
	 * const client = new SnowTransfer("TOKEN")
	 * const invite = await client.invite.getInvite("inviteId", { with_counts: true })
	 */
	public async getInvite(inviteId: string, options?: RESTGetAPIInviteQuery): Promise<RESTGetAPIInviteResult> {
		return this.requestHandler.request(Endpoints.INVITES(inviteId), options, "get", "json");
	}

	/**
	 * Delete an invite
	 * @since 0.1.0
	 * @param inviteId
	 * @returns [Invite Object](https://discord.com/developers/docs/resources/invite#invite-object)
	 *
	 * | Permissions needed | Condition                                     |
	 * |--------------------|-----------------------------------------------|
	 * | MANAGE_CHANNELS    | for invite that belongs to a specific channel |
	 * | MANAGE_GUILD       | delete any invite guild wide                  |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const invite = await client.invite.deleteInvite("inviteId")
	 */
	public async deleteInvite(inviteId: string): Promise<RESTDeleteAPIInviteResult> {
		return this.requestHandler.request(Endpoints.INVITES(inviteId), {}, "delete", "json");
	}
}

export = InviteMethods;
