import Endpoints = require("../Endpoints");
import type { RequestHandler as RH } from "../RequestHandler";

import type {
	RESTGetAPIAutoModerationRulesResult,
	RESTGetAPIAutoModerationRuleResult,
	RESTPostAPIAutoModerationRuleJSONBody,
	RESTPostAPIAutoModerationRuleResult,
	RESTPatchAPIAutoModerationRuleJSONBody,
	RESTPatchAPIAutoModerationRuleResult,
	RESTDeleteAPIAutoModerationRuleResult
} from "discord-api-types/v10";

/**
 * Methods for interacting with guild auto moderation
 */
class AutoModerationMethods {
	/**
	 * Create a new Auto Moderation Method Handler
	 *
	 * Usually SnowTransfer creates a method handler for you, this is here for completion
	 *
	 * You can access the methods listed via `client.autoMod.method`, where `client` is an initialized SnowTransfer instance
	 * @param requestHandler request handler that calls the rest api
	 */
	public constructor(public requestHandler: RH) {}

	/**
	 * Get all of the auto moderation rules from a guild
	 * @param guildId id of the guild
	 * @returns A list of [auto mod rules](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // gets all automod rules of a guild
	 * const client = new SnowTransfer("TOKEN")
	 * const rules = await client.autoMod.getAutoModerationRules("guild id")
	 */
	public async getAutoModerationRules(guildId: string): Promise<RESTGetAPIAutoModerationRulesResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUTO_MOD_RULES(guildId), {}, "get", "json");
	}

	/**
	 * Get a auto moderation rules from a guild
	 * @param guildId id of the guild
	 * @param ruleId id of the rule
	 * @returns An [auto mod rule](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // gets an automod rule from a guild
	 * const client = new SnowTransfer("TOKEN")
	 * const rule = await client.autoMod.getAutoModerationRule("guild id", "rule id")
	 */
	public async getAutoModerationRule(guildId: string, ruleId: string): Promise<RESTGetAPIAutoModerationRuleResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUTO_MOD_RULE(guildId, ruleId), {}, "get", "json");
	}

	/**
	 * Create an auto moderation rule for a guild
	 * @param guildId id of the guild
	 * @param data the data of the auto moderation rule
	 * @returns An [auto mod rule](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * const data = {
	 * 	name: "mention_spam_prevent",
	 * 	event_type: 1,
	 * 	trigger_type: 5,
	 * 	trigger_metadata: {
	 * 		mention_total_limit: 6
	 * 	},
	 * 	actions: [
	 * 		{
	 * 			type: 1
	 * 		}
	 * 	]
	 * }
	 * const newRule = await client.autoMod.createAutoModerationRule("guild id", data)
	 */
	public async createAutoModerationRule(guildId: string, data: RESTPostAPIAutoModerationRuleJSONBody & { reason?: string }): Promise<RESTPostAPIAutoModerationRuleResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUTO_MOD_RULES(guildId), {}, "post", "json", data);
	}

	/**
	 * Edit an auto moderation rule for a guild
	 * @param guildId id of the guild
	 * @param ruleId id of the rule
	 * @param data the data of the auto moderation rule
	 * @returns An [auto mod rule](https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object)
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * // Turn on the rule I forgot was disabled by default
	 * const client = new SnowTransfer("TOKEN")
	 * const data = {
	 * 	name: "mention_spam_prevention",
	 * 	enabled: true,
	 * 	reason: "It's turned off by default and I forgor"
	 * }
	 * const updatedRule = await client.autoMod.editAutoModerationRule("guild id", "rule id", data)
	 */
	public async editAutoModerationRule(guildId: string, ruleId: string, data: RESTPatchAPIAutoModerationRuleJSONBody & { reason?: string }): Promise<RESTPatchAPIAutoModerationRuleResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUTO_MOD_RULE(guildId, ruleId), {}, "patch", "json", data);
	}

	/**
	 * Deletes an auto moderation rule for a guild
	 * @param guildId id of the guild
	 * @param ruleId id of the rule
	 * @param reason Reason for deleting the rule
	 * @returns Resolves the Promise on successful execution
	 *
	 * | Permissions needed | Condition |
	 * |--------------------|-----------|
	 * | MANAGE_GUILD       | always    |
	 *
	 * @example
	 * const client = new SnowTransfer("TOKEN")
	 * client.autoMod.deleteAutoModerationRules("guild id", "rule id", "was useless")
	 */
	public async deleteAutoModerationRule(guildId: string, ruleId: string, reason?: string): Promise<RESTDeleteAPIAutoModerationRuleResult> {
		return this.requestHandler.request(Endpoints.GUILD_AUTO_MOD_RULE(guildId, ruleId), {}, "delete", "json", { reason }) as RESTDeleteAPIAutoModerationRuleResult;
	}
}

export = AutoModerationMethods;
