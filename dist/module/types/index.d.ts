import { Transaction } from "xrpl";
export interface ConnectionMeta {
    cancelled: boolean;
    expired: boolean;
    expires_at: string;
    identifier: string;
    opened: boolean;
    pushed: boolean;
    resolved: boolean;
    signed: boolean;
    submit: boolean;
}
export declare enum States {
    OPENED = "opened",
    PUSHED = "pushed",
    RESOLVED = "resolved",
    SIGNED = "signed",
    CANCELLED = "cancelled",
    EXPIRED = "expiredYes"
}
export interface ConnectionRefs {
    deeplink: string;
    qr: string;
    ws?: string;
}
export interface ConnectionResponse {
    meta: ConnectionMeta;
    refs: ConnectionRefs;
    tx_json: Transaction;
}
export interface SigningMeta {
    identifier: string;
    expires_at: string;
    refs: ConnectionRefs;
    tx: Transaction;
}
