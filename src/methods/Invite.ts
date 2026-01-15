import Endpoints = require("../Endpoints");
import Constants = require("../Constants");

import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTDeleteAPIInviteResult,
	RESTGetAPIInviteQuery,
	RESTGetAPIInviteResult,
} from "discord-api-types/v10";

import type { RESTGetAPIInviteTargetUsers, RESTGetAPIInviteTargetUsersJobStatus, RESTPutAPIInviteTargetUsers } from "../Types";

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
	 * @param inviteId Id of the invite
	 * @param reason Reason for deleting the invite
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
	public async deleteInvite(inviteId: string, reason?: string): Promise<RESTDeleteAPIInviteResult> {
		return this.requestHandler.request(Endpoints.INVITES(inviteId), {}, "delete", "json", undefined, Constants.reasonHeader(reason));
	}

	/**
	 * Gets the users allowed to see and accept an invite
	 * @since 0.17.0
	 * @param inviteId Id of the invite
	 * @returns An Array of user IDs
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const userIds = await client.invite.getInviteTargetUsers("inviteId")
	 */
	public async getInviteTargetUsers(inviteId: string): Promise<RESTGetAPIInviteTargetUsers> {
		const response = await this.requestHandler.request(Endpoints.INVITE_TARGET_USERS(inviteId), {}, "get", "json", undefined, undefined, this.requestHandler.options.retryLimit, true) as Response;
		let b: string
		try {
			b = await response.text();
		} catch {
			b = ""
		}
		if (!b.length) return [];
		return b.split("\n").slice(1).map(l => l.replace(",", "").trim()); // first line is the table column names, but only Users exists
	}

	/**
	 * Updates the users allowed to see and accept an invite
	 * @since 0.17.0
	 * @param inviteId Id of the invite
	 * @returns Resolves the Promise on successful execution
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * await client.invite.updateInviteTargetUsers("inviteId", someUserArray)
	 */
	public async updateInviteTargetUsers(inviteId: string, userIds: Array<string>): Promise<RESTPutAPIInviteTargetUsers> {
		const csv = `Users\n${userIds.join("\n")}`;
		const form = new FormData();
		await Constants.standardAddToFormHandler(form, "target_users_file", csv, "target_users_file.csv");
		return this.requestHandler.request(Endpoints.INVITE_TARGET_USERS(inviteId), { target_users_file: "target_users_file.csv" }, "put", "multipart", form) as RESTPutAPIInviteTargetUsers;
	}

	/**
	 * Gets the job status on setting target users to an invite
	 * @param inviteId Id of the invite
	 * @returns [Target Users Job Status Object](https://discord.com/developers/docs/resources/invite#get-target-users-job-status-example-response)
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const jobStatus = await client.invite.getInviteTargetUsersJobStatus("inviteId")
	 */
	public async getInviteTargetUsersJobStatus(inviteId: string): Promise<RESTGetAPIInviteTargetUsersJobStatus> {
		return this.requestHandler.request(Endpoints.INVITE_TARGET_USERS_JOB_STATUS(inviteId), {}, "get", "json");
	}
}

export = InviteMethods;
