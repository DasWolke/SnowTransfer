"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class InviteMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    async getInvite(inviteId, withCounts = false) {
        return this.requestHandler.request(Endpoints_1.default.INVITE(inviteId), "get", "json", { with_counts: withCounts });
    }
    async deleteInvite(inviteId) {
        return this.requestHandler.request(Endpoints_1.default.INVITE(inviteId), "delete", "json");
    }
}
module.exports = InviteMethods;
