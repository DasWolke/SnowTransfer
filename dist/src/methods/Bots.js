"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class BotMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    getGateway() {
        return this.requestHandler.request(Endpoints_1.default.GATEWAY, "get", "json");
    }
    getGatewayBot() {
        return this.requestHandler.request(Endpoints_1.default.GATEWAY_BOT, "get", "json");
    }
}
module.exports = BotMethods;
