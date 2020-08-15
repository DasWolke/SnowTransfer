import Ratelimiter = require("../src/Ratelimiter");
import RequestHandler = require("../src/RequestHandler");

import ChannelMethods = require("../src/methods/Channels");
import UserMethods = require("../src/methods/Users");
import EmojiMethods = require("../src/methods/Emojis");
import WebhookMethods = require("../src/methods/Webhooks");
import GuildMethods = require("../src/methods/Guilds");
import InviteMethods = require("../src/methods/Invites");
import VoiceMethods = require("../src/methods/Voices");
import BotMethods = require("../src/methods/Bots");
import AuditLogMethods = require("../src/methods/AuditLog");

interface SnowTransferOptions {
	baseHost?: string;
	disableEveryone?: boolean;
}

class SnowTransfer {
	constructor(token: string, options: SnowTransferOptions);

	public token: string;

	public options: {
		baseHost?: string;
		disableEveryone: boolean;
		sentryOptions: {
			extra: {
				snowtransferVersion: string;
			}
		}
		useRedis: boolean;
	}

	public ratelimiter: Ratelimiter;
	public requestHandler: RequestHandler;

	public channel: ChannelMethods;
	public user: UserMethods;
	public emoji: EmojiMethods;
	public webhook: WebhookMethods;
	public guild: GuildMethods;
	public invite: InviteMethods;
	public voice: VoiceMethods;
	public bot: BotMethods;
	public auditLog: AuditLogMethods;
}

export = SnowTransfer;
