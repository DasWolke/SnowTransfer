import Endpoints = require("../Endpoints");

import {
	RESTGetAPIAuditLogQuery,
	RESTGetAPIAuditLogResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with Guild Audit Logs
 */
class AuditLogMethods {
	/**
	 * Create a new Audit Log Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.auditLog.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: InstanceType<(typeof import("../RequestHandler"))["RequestHandler"]>) {}

	/**
	 * Get the audit logs of the specified guild id
	 * @param guildId id of a guild
	 * @param options optional audit log filter values
	 * @returns An object with [audit log data](https://discord.com/developers/docs/resources/audit-log#audit-log-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | VIEW_AUDIT_LOG     | always    |
	 *
	 * @example
	 * // Get an audit log entry of user 12345678901234567 updating themself (24 is MEMBER_UPDATE)
	 * const client = new SnowTransfer("TOKEN")
	 * const data = {
	 * 	user_id: "12345678901234567",
	 * 	action_type: 24,
	 * }
	 * const channel = await client.auditLog.getAuditLog("guild id", data)
	 */
	public async getAuditLog(guildId: string, options?: RESTGetAPIAuditLogQuery): Promise<RESTGetAPIAuditLogResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUDIT_LOGS(guildId), options, "get", "json");
	}
}

export = AuditLogMethods;
