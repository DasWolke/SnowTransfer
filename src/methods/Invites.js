const Endpoints = require('../Endpoints');

/**
 * Methods for interacting with invites
 */
class InviteMethods {
    /**
     * Create a new Invite Method Handler
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get the invite data on an invite id
     * @param {String} inviteId - Id of the invite
     * @returns {Promise.<Object>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     */
    async getInvite(inviteId) {
        return this.requestHandler.request(Endpoints.INVITE(inviteId), 'get', 'json');
    }

    /**
     * Delete an invite
     * @param {String} inviteId
     * @returns {Promise.<Object>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     */
    async deleteInvite(inviteId) {
        return this.requestHandler.request(Endpoints.INVITE(inviteId), 'delete', 'json');
    }
}

module.exports = InviteMethods;