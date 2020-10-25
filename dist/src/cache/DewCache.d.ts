declare class DewCache extends Map {
    constructor();
    wrap(key: string, promise: Promise<any>): Promise<any>;
    fetch(key: string, fallback: (key?: string) => any): Promise<any>;
}
export = DewCache;
