export declare function removeUndefinedFromObj(obj: Record<string, unknown>): Record<string, unknown>;
interface ParsedApiKey {
    key: string;
    name: string;
    isTesting: boolean;
}
export declare const parseApiKey: (inKey: string) => ParsedApiKey;
export {};
