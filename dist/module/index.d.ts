/// <reference types="node" />
import EventEmitter from "events";
import { Transaction, SigningMeta } from "./types";
interface SOLODEXProps {
    sign_expiry?: number;
    api_key?: string;
}
declare class SOLODEX extends EventEmitter {
    private _sign_expiry;
    private _push_token;
    private _api_key;
    constructor(props: SOLODEXProps);
    setPushToken(token: string): void;
    signIn(): Promise<SigningMeta>;
    signTransaction(tx: Transaction): Promise<SigningMeta>;
    private _monitorConnection;
}
export default SOLODEX;
