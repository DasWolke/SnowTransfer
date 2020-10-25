"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
const UserCache_1 = __importDefault(require("../cache/UserCache"));
class UserMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
        this.cache = new UserCache_1.default(this);
    }
    async getSelf() {
        return this.cache.wrap("@me", this.requestHandler.request(Endpoints_1.default.USER("@me"), "get", "json"));
    }
    async getUser(userId) {
        return this.cache.wrap(userId, this.requestHandler.request(Endpoints_1.default.USER(userId), "get", "json"));
    }
    async updateSelf(data) {
        return this.cache.wrap("@me", this.requestHandler.request(Endpoints_1.default.USER("@me"), "patch", "json", data));
    }
    async getGuilds() {
        return this.requestHandler.request(Endpoints_1.default.USER_GUILDS("@me"), "get", "json");
    }
    async leaveGuild(guildId) {
        return this.requestHandler.request(Endpoints_1.default.USER_GUILD("@me", guildId), "delete", "json");
    }
    async getDirectMessages() {
        return this.requestHandler.request(Endpoints_1.default.USER_CHANNELS("@me"), "get", "json");
    }
    async createDirectMessageChannel(userId) {
        return this.requestHandler.request(Endpoints_1.default.USER_CHANNELS("@me"), "post", "json", { recipient_id: userId });
    }
}
module.exports = UserMethods;
