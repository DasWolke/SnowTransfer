declare class BotMethods {
    requestHandler: import("../RequestHandler");
    constructor(requestHandler: import("../RequestHandler"));
    getGateway(): Promise<GatewayData>;
    getGatewayBot(): Promise<GatewayData>;
}
interface GatewayData {
    url: string;
    shards?: number;
}
export = BotMethods;
