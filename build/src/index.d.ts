/// <reference types="node" />
import EventEmitter from "events";
import { Transaction, SigningMeta } from "./types/index";
interface SOLODEXProps {
    sign_expiry?: number;
}
declare class SOLODEX extends EventEmitter {
    private _sign_expiry;
    private _push_token;
    constructor(props: SOLODEXProps);
    signIn(): Promise<SigningMeta>;
    setPushToken(token: string): void;
    signTransaction(tx: Transaction): Promise<SigningMeta>;
    private _monitorConnection;
}
export default SOLODEX;
