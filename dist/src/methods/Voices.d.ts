declare class VoiceMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    getVoiceRegions(): Promise<Array<any>>;
}
export = VoiceMethods;
