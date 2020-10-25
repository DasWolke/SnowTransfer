"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class AuditLogMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    async getAuditLog(guildId, data) {
        return this.requestHandler.request(Endpoints_1.default.GUILD_AUDIT_LOGS(guildId), "get", "json", data);
    }
}
module.exports = AuditLogMethods;
