import Endpoints from "../Endpoints";

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
	 * @returns An object with audit log data
	 *
	 * | Permissions needed |
	 * |--------------------|
	 * | VIEW_AUDIT_LOG     |
	 */
	public async getAuditLog(guildId: string, data?: GetAuditLogOptions): Promise<AuditLogObject> {
		return this.requestHandler.request(Endpoints.GUILD_AUDIT_LOGS(guildId), "get", "json", data);
	}
}

/**
 * Audit Log Object
 */
interface AuditLogObject {
	/**
	 * list of [webhooks](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure) found in the audit log
	 */
	webhooks: Array<any>;
	/**
	 * list of [users](https://discord.com/developers/docs/resources/user#user-object) found in the audit log
	 */
	users: Array<import("@amanda/discordtypings").UserData>;
	/**
	 * list of [audit log entries](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-entry-structure)
	 */
	audit_log_entries: Array<AuditLogEntry>;
}

interface AuditLogEntry {
	target_id: string;
	changes: Array<AuditLogChange>;
	user_id: string;
	id: string;
	action_type: number;
	options: any;
	reason: string;
}

interface AuditLogChange {
	new_value: string | number | boolean | Array<import("@amanda/discordtypings").RoleData> | Array<import("@amanda/discordtypings").PermissionOverwriteData>;
	old_value: string | number | boolean | Array<import("@amanda/discordtypings").RoleData> | Array<import("@amanda/discordtypings").PermissionOverwriteData>;
	key: string;
}

interface GetAuditLogOptions {
	/**
	 * Filter the audit log with the id of a user
	 */
	user_id?: string;
	/**
	 * [Type](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events) of the audit log event
	 */
	action_type?: number;
	/**
	 * Filter the audit log before a certain entry id
	 */
	before?: string;
	/**
	 * How many entries are returned (min 1, max 100)
	 */
	limit: number;
}

export = AuditLogMethods;
