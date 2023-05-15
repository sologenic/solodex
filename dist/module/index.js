import axios from "axios";
import EventEmitter from "events";
import { getConnectionRefs } from "./utils/index";
import { States, } from "./types/index";
var ws = WebSocket;
if (ws === undefined)
    ws = require("ws");
class SOLODEX extends EventEmitter {
    _sign_expiry = 600_000;
    _push_token;
    _api_key;
    constructor(props) {
        super();
        if (!props.api_key)
            throw new Error("FATAL: API Key is missing.");
        if (props?.sign_expiry)
            this._sign_expiry = props.sign_expiry;
    }
    setPushToken(token) {
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
                },
                tx,
            };
        }
        catch (e) {
            console.log("EEEEE", e);
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
            const connectionWS = new WebSocket(connection.refs.ws);
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
                                    url: `https://api.sologenic.org/api/v1/issuer/transactions/${msg.meta.identifier}`,
                                });
                                this._push_token = msg.meta.push_token;
                                this.emit(States.SIGNED, msg.meta.identifier, {
                                    signer: signedTX.data.signer,
                                    tx: connection.tx_json,
                                    push_token: msg.meta.push_token,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQzFCLE9BQU8sWUFBWSxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUVMLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7QUFFbkIsSUFBSSxFQUFFLEtBQUssU0FBUztJQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFPekMsTUFBTSxPQUFRLFNBQVEsWUFBWTtJQUN4QixZQUFZLEdBQVcsT0FBTyxDQUFDO0lBQy9CLFdBQVcsQ0FBcUI7SUFDaEMsUUFBUSxDQUFTO0lBRXpCLFlBQVksS0FBbUI7UUFDN0IsS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsSUFBSSxLQUFLLEVBQUUsV0FBVztZQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNoRSxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1YsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHO2dCQUNkLGVBQWUsRUFBRSxhQUFhO2dCQUM5QixlQUFlLEVBQUUsUUFBUTthQUMxQixDQUFDO1lBRUYsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU07Z0JBQ0osT0FBTyxFQUFFLFFBQVE7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