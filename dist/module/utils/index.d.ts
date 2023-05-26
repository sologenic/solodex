import { ConnectionResponse } from "../types/index";
interface ConnectionOptions {
    pushToken?: string;
    expiry: number;
    api_key?: string;
}
export declare const getConnectionRefs: (tx: any, options: ConnectionOptions) => Promise<ConnectionResponse>;
export {};
