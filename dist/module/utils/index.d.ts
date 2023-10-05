import { ConnectionResponse } from "../types/index";
interface ConnectionOptions {
    pushToken?: string;
    expiry: number;
    api_key?: string;
}
export declare const url = "https://api.sologenic.org/api/v1";
export declare const getConnectionRefs: (tx: any, options: ConnectionOptions) => Promise<ConnectionResponse>;
export {};
