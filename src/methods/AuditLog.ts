import Endpoints from "../Endpoints";

/**
 * Methods for interacting with Guild Audit Logs
 */
class AuditLogMethods {
	public requestHandler: import("../RequestHandler");

	/**
	 * Create a new Audit Log Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.auditLog.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(requestHandler: import("../RequestHandler")) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get the audit logs of the specified guild id
	 * @param guildId id of a guild
	 * @param data optional audit log filter values
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
	public async getAuditLog(guildId: string, data?: { user_id?: string; action_type?: import("discord-typings").AuditLogEvent; before?: string; limit?: number; }): Promise<import("discord-typings").AuditLog> {
		return this.requestHandler.request(Endpoints.GUILD_AUDIT_LOGS(guildId), "get", "json", data);
	}
}

export = AuditLogMethods;
