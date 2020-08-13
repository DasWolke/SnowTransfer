const Endpoints = require("../Endpoints");

class AuditLogMethods {
	/**
	 * Create a new Audit Log Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.auditLog.method`, where `client` is an initialized SnowTransfer instance
	 * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
	 */
	constructor(requestHandler) {
		this.requestHandler = requestHandler;
	}

	/**
	 * Get the audit logs of the specified guild id
	 * @param {string} guildId - id of a guild
	 * @param {object} [data] - optional audit log filter values
	 * @param {string} [data.user_id] - Filter the audit log with the id of a user
	 * @param {number} [data.action_type] - [Type](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events) of the audit log event
	 * @param {string} [data.before] - Filter the audit log before a certain entry id
	 * @param {number} [data.limit=50] - How many entries are returned (min 1, max 100)
	 * @returns {Promise<AuditLogObject>} - An object with audit log data
	 *
	 * | Permissions needed |
	 |--------------------|
	 | VIEW_AUDIT_LOG   |
	 */
	async getAuditLog(guildId, data) {
		// @ts-ignore
		return this.requestHandler.request(Endpoints.GUILD_AUDIT_LOGS(guildId), "get", "json", null, data);
	}
}

/**
 * @typedef {object} AuditLogObject
 * @description Audit Log Object
 * @property {Webhook[]} webhooks - list of [webhooks](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure) found in the audit log
 * @property {User[]} users - list of [users](https://discord.com/developers/docs/resources/user#user-object) found in the audit log
 * @property {AuditLogEntry[]} audit_log_entries - list of [audit log entries](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-entry-structure)
 */

/**
 * @typedef {object} AuditLogEntry
 * @description A single audit log entry object
 * @property {string} target_id - id of the affected entity (webhook, user, role, etc...)
 * @property {AuditLogChange[]} changes - array of changes made to the target_id
 * @property {string} user_id - id of the user who made the changes
 * @property {string} id - id of the entry
 * @property {number} action_type - [type](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events) of the action
 * @property {object} options - [additional info](https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info) for some action types
 * @property {string} reason - reason for the change
 */

/**
 * @typedef {object} AuditLogChange
 * @description A single audit log change object
 * @property {String|Number|Boolean|Role[]|PermissionOverwrite[]} new_value - new value of the key
 * @property {String|Number|Boolean|Role[]|PermissionOverwrite[]} old_value - old value of the key
 * @property {string} key - type of [audit log change key](https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-key)
 * @type {AuditLogMethods}
 */
module.exports = AuditLogMethods;
