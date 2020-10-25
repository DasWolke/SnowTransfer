"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Endpoints_1 = __importDefault(require("../Endpoints"));
class VoiceMethods {
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }
    async getVoiceRegions() {
        return this.requestHandler.request(Endpoints_1.default.VOICE_REGIONS, "get", "json");
    }
}
module.exports = VoiceMethods;
