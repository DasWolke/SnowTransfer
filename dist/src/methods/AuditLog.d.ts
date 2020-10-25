declare class AuditLogMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    getAuditLog(guildId: string, data?: GetAuditLogOptions): Promise<AuditLogObject>;
}
interface AuditLogObject {
    webhooks: Array<any>;
    users: Array<import("@amanda/discordtypings").UserData>;
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
    user_id?: string;
    action_type?: number;
    before?: string;
    limit: number;
}
export = AuditLogMethods;
