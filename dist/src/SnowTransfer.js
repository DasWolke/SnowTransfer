"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Ratelimiter_1 = __importDefault(require("./Ratelimiter"));
;
const RequestHandler_1 = __importDefault(require("./RequestHandler"));
;
const Channels_1 = __importDefault(require("./methods/Channels"));
;
const Users_1 = __importDefault(require("./methods/Users"));
;
const Emojis_1 = __importDefault(require("./methods/Emojis"));
;
const Webhooks_1 = __importDefault(require("./methods/Webhooks"));
;
const Guilds_1 = __importDefault(require("./methods/Guilds"));
;
const Invites_1 = __importDefault(require("./methods/Invites"));
;
const Voices_1 = __importDefault(require("./methods/Voices"));
;
const Bots_1 = __importDefault(require("./methods/Bots"));
;
const AuditLog_1 = __importDefault(require("./methods/AuditLog"));
;
const Endpoints_1 = __importDefault(require("./Endpoints"));
const package_json_1 = require("../package.json");
class SnowTransfer {
    constructor(token, options) {
        if (!token || token === "") {
            throw new Error("Missing token");
        }
        if (!token.startsWith("Bot")) {
            token = `Bot ${token}`;
        }
        this.options = { baseHost: Endpoints_1.default.BASE_HOST, disableEveryone: false, sentryOptions: { extra: { snowtransferVersion: package_json_1.version } }, useRedis: false };
        this.token = token;
        Object.assign(this.options, options);
        this.ratelimiter = new Ratelimiter_1.default();
        this.requestHandler = new RequestHandler_1.default(this.ratelimiter, {
            token: this.token,
            baseHost: this.options.baseHost || Endpoints_1.default.BASE_HOST
        });
        this.channel = new Channels_1.default(this.requestHandler, this.options.disableEveryone);
        this.user = new Users_1.default(this.requestHandler);
        this.emoji = new Emojis_1.default(this.requestHandler);
        this.webhook = new Webhooks_1.default(this.requestHandler, this.options.disableEveryone);
        this.guild = new Guilds_1.default(this.requestHandler);
        this.invite = new Invites_1.default(this.requestHandler);
        this.voice = new Voices_1.default(this.requestHandler);
        this.bot = new Bots_1.default(this.requestHandler);
        this.auditLog = new AuditLog_1.default(this.requestHandler);
    }
}
module.exports = SnowTransfer;
