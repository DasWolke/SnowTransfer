import RequestHandler from "../RequestHandler";
import { TInvite } from "../LibTypes";
/**
 * Methods for interacting with invites
 */
declare class InviteMethods {
    private requestHandler;
    /**
     * Create a new Invite Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.invite.method`, where `client` is an initialized SnowTransfer instance
     * @param {RequestHandler} requestHandler - request handler that calls the rest api
     */
    constructor(requestHandler: RequestHandler);
    /**
     * Get the invite data on an invite id
     * @param {String} inviteId - Id of the invite
     * @param {Boolean} [withCounts] - When set to true you get an invite object with additional `approximate_presence_count` and `approximate_member_count` fields
     * @returns {Promise.<Invite>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     */
    getInvite(inviteId: string, withCounts: string): Promise<TInvite>;
    /**
     * Delete an invite
     * @param {String} inviteId
     * @returns {Promise.<Invite>} [Invite Object](https://discordapp.com/developers/docs/resources/invite#invite-object)
     *
     * | Permissions needed | condition |
     |--------------------|-----------:|
     | MANAGE_CHANNELS    | always    |
     */
    deleteInvite(inviteId: string): Promise<TInvite>;
}
/**
 * @typedef {Object} Invite
 * @property {String} code - unique id code of the invite
 * @property {Guild} guild - partial guild object of the invite
 * @property {Channel} channel - partial channel object of the invite
 * @property {User} [inviter] - creator of the invite
 * @property {Number} [uses] - how often the invite was used
 * @property {Number} [max_uses] - how often the invite can be used
 * @property {Number} [max_age] - duration in seconds until the invite expires
 * @property {Boolean} [temporary] - if this invite only grants temporary membership
 * @property {Date} [created_at] - when the invite was created
 * @property {Boolean} [revoked] - if this invite has been revoked
 */
export default InviteMethods;
//# sourceMappingURL=Invites.d.ts.map