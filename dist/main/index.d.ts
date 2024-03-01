/// <reference types="node" />
import EventEmitter from "events";
import { SigningMeta } from "./types";
import { Transaction } from "xrpl";
interface SOLODEXProps {
    sign_expiry?: number;
    api_key?: string;
    custom_tx_delivery_endpoint?: string;
}
declare class SOLODEX extends EventEmitter {
    private _sign_expiry;
    private _push_token;
    private _api_key;
    private _custom_endpoint;
    constructor(props: SOLODEXProps);
    get token(): string;
    setPushToken(token: string): void;
    signIn(): Promise<SigningMeta>;
    signTransaction(tx: Transaction): Promise<SigningMeta>;
    private _monitorConnection;
}
export default SOLODEX;
