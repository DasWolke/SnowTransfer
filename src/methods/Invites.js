const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with invites
 */
class InviteMethods {
    /**
     * Create a new Invite Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.invite.method`, where `client` is an initialized SnowTransfer instance
     * @param {import("../RequestHandler")} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get the invite data on an invite id
     * @param {string} inviteId - Id of the invite
     * @param {Boolean} [withCounts] - When set to true you get an invite object with additional `approximate_presence_count` and `approximate_member_count` fields
     * @returns {Promise<Invite>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     */
    async getInvite(inviteId, withCounts = false) {
        let futureKey = `get:${Endpoints.INVITE(inviteId)}:json:${withCounts}`
        return this.requestHandler.request(Endpoints.INVITE(inviteId), 'get', 'json', futureKey, {with_counts: withCounts});
    }

    /**
     * Delete an invite
     * @param {string} inviteId
     * @returns {Promise<Invite>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_CHANNELS    | always    |
     */
    async deleteInvite(inviteId) {
        return this.requestHandler.request(Endpoints.INVITE(inviteId), 'delete', 'json');
    }
}

/**
 * @typedef {object} Invite
 * @property {string} code - unique id code of the invite
 * @property {Guild} guild - partial guild object of the invite
 * @property {Channel} channel - partial channel object of the invite
 * @property {User} [inviter] - creator of the invite
 * @property {number} [uses] - how often the invite was used
 * @property {number} [max_uses] - how often the invite can be used
 * @property {number} [max_age] - duration in seconds until the invite expires
 * @property {Boolean} [temporary] - if this invite only grants temporary membership
 * @property {Date} [created_at] - when the invite was created
 * @property {Boolean} [revoked] - if this invite has been revoked
 */


module.exports = InviteMethods;
