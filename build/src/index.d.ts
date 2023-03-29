/// <reference types="node" />
import EventEmitter from "events";
import { Transaction, SigningMeta } from "./types/index";
interface SOLODEXProps {
    sign_expiry?: number;
}
declare class SOLODEX extends EventEmitter {
    #private;
    constructor(props: SOLODEXProps);
    setPushToken(token: string): void;
    signIn(): Promise<SigningMeta>;
    signTransaction(tx: Transaction): Promise<SigningMeta>;
}
export default SOLODEX;
