import axios from "axios";
import EventEmitter from "events";
import { getConnectionRefs, url } from "./utils";
import { States } from "./types";
const Websocket = typeof window === "object" ? WebSocket : require("ws");
class SOLODEX extends EventEmitter {
    _sign_expiry = 600_000;
    _push_token;
    _api_key;
    constructor(props) {
        super();
        if (props?.sign_expiry)
            this._sign_expiry = props.sign_expiry;
        if (props?.api_key)
            this._api_key = props.api_key;
    }
    set token(push_token) {
        this._push_token = push_token;
    }
    get token() {
        return this._push_token;
    }
    setPushToken(token) {
        console.log("Le supposed token ", token);
        this._push_token = token;
    }
    async signIn() {
        try {
            const tx_json = {
                TransactionType: "NickNameSet",
                TransactionKind: "SignIn",
            };
            return await this.signTransaction(tx_json);
        }
        catch (e) {
            throw {
                thrower: "signIn",
                error: e,
            };
        }
    }
    async signTransaction(tx) {
        try {
            const connection = await getConnectionRefs(tx, {
                expiry: this._sign_expiry,
                pushToken: this._push_token,
                api_key: this._api_key,
            });
            this._monitorConnection(connection);
            return {
                identifier: connection.meta.identifier,
                expires_at: connection.meta.expires_at,
                refs: {
                    deeplink: connection.refs.deeplink,
                    qr: connection.refs.qr,
                    ws: connection.refs.ws,
                },
                tx,
            };
        }
        catch (e) {
            throw {
                thrower: e.thrower || "sign",
                error: e,
            };
        }
    }
    async _monitorConnection(connection) {
        try {
            let ping;
            let eventsEmitted = [];
            const connectionWS = new Websocket(connection.refs.ws);
            connectionWS.onerror = (error) => {
                throw {
                    thrower: "WS Monitor connection",
                    error: error,
                };
            };
            connectionWS.addEventListener("open", () => {
                console.log(`Connection to WS for ${connection.meta.identifier} initialized`);
                ping = setInterval(() => {
                    connectionWS.send("ping");
                }, 5000);
            });
            connectionWS.addEventListener("message", async (message) => {
                if (message.data === "pong")
                    return;
                const msg = JSON.parse(message.data);
                if (msg.meta.hasOwnProperty("identifier")) {
                    Object.entries(msg.meta).map(async (entry) => {
                        if (entry[1] === true && !eventsEmitted.includes(entry[0])) {
                            if (entry[0] === States.SIGNED) {
                                const signedTX = await axios({
                                    method: "get",
                                    url: `${url}/issuer/transactions/${msg.meta.identifier}`,
                                });
                                console.log("Message ", msg);
                                // this._push_token = msg.meta.push_token;
                                this.setPushToken(msg.meta.push_token);
                                this.emit(States.SIGNED, msg.meta.identifier, {
                                    signer: signedTX.data.signer,
                                    tx: connection.tx_json,
                                    push_token: msg.meta.push_token,
                                    tx_blob: signedTX.data.tx_hex,
                                });
                            }
                            else {
                                this.emit(entry[0], msg.meta.identifier);
                                eventsEmitted.push(entry[0]);
                            }
                            if ([States.SIGNED, States.CANCELLED, States.EXPIRED].includes(entry[0])) {
                                connectionWS.close();
                                clearInterval(ping);
                            }
                        }
                    });
                }
            });
        }
        catch (e) {
            throw {
                thrower: e.thrower || "monitorConnection",
                error: e,
            };
        }
    }
}
export default SOLODEX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sWUFBWSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2pELE9BQU8sRUFBc0IsTUFBTSxFQUE0QixNQUFNLFNBQVMsQ0FBQztBQUUvRSxNQUFNLFNBQVMsR0FBRyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBT3pFLE1BQU0sT0FBUSxTQUFRLFlBQVk7SUFDeEIsWUFBWSxHQUFXLE9BQU8sQ0FBQztJQUMvQixXQUFXLENBQXFCO0lBQ2hDLFFBQVEsQ0FBcUI7SUFFckMsWUFBWSxLQUFtQjtRQUM3QixLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksS0FBSyxFQUFFLFdBQVc7WUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFFOUQsSUFBSSxLQUFLLEVBQUUsT0FBTztZQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUNwRCxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsVUFBa0I7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWE7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFD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