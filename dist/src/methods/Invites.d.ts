declare class InviteMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    getInvite(inviteId: string, withCounts?: boolean | undefined): Promise<any>;
    deleteInvite(inviteId: string): Promise<any>;
}
export = InviteMethods;
