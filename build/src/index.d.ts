/// <reference types="node" />
import EventEmitter from "events";
import { Transaction, SigningMeta } from "./types/index";
interface SOLODEXProps {
    sign_expiry?: number;
}
declare class SOLODEX extends EventEmitter {
    private _sign_expiry;
    constructor(props: SOLODEXProps);
    newConnection(): Promise<SigningMeta>;
    sign(tx: Transaction): Promise<SigningMeta>;
    private _monitorConnection;
}
export default SOLODEX;
