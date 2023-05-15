"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const events_1 = __importDefault(require("events"));
const index_1 = require("./utils/index");
const index_2 = require("./types/index");
var ws = WebSocket;
if (ws === undefined)
    ws = require("ws");
class SOLODEX extends events_1.default {
    constructor(props) {
        super();
        this._sign_expiry = 600000;
        if (!props.api_key)
            throw new Error("FATAL: API Key is missing.");
        if (props === null || props === void 0 ? void 0 : props.sign_expiry)
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
            const connection = await (0, index_1.getConnectionRefs)(tx, {
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
                            if (entry[0] === index_2.States.SIGNED) {
                                const signedTX = await (0, axios_1.default)({
                                    method: "get",
                                    url: `https://api.sologenic.org/api/v1/issuer/transactions/${msg.meta.identifier}`,
                                });
                                this._push_token = msg.meta.push_token;
                                this.emit(index_2.States.SIGNED, msg.meta.identifier, {
                                    signer: signedTX.data.signer,
                                    tx: connection.tx_json,
                                    push_token: msg.meta.push_token,
                                });
                            }
                            else {
                                this.emit(entry[0], msg.meta.identifier);
                                eventsEmitted.push(entry[0]);
                            }
                            if ([index_2.States.SIGNED, index_2.States.CANCELLED, index_2.States.EXPIRED].includes(entry[0])) {
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
exports.default = SOLODEX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0RBQWtDO0FBQ2xDLHlDQUFrRDtBQUNsRCx5Q0FLdUI7QUFFdkIsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBRW5CLElBQUksRUFBRSxLQUFLLFNBQVM7SUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBT3pDLE1BQU0sT0FBUSxTQUFRLGdCQUFZO0lBS2hDLFlBQVksS0FBbUI7UUFDN0IsS0FBSyxFQUFFLENBQUM7UUFMRixpQkFBWSxHQUFXLE1BQU8sQ0FBQztRQU9yQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVztZQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztJQUNoRSxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWE7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1YsSUFBSTtZQUNGLE1BQU0sT0FBTyxHQUFHO2dCQUNkLGVBQWUsRUFBRSxhQUFhO2dCQUM5QixlQUFlLEVBQUUsUUFBUTthQUMxQixDQUFDO1lBRUYsT0FBTyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU07Z0JBQ0osT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBZTtRQUNuQyxJQUFJO1lBQ0YsTUFBTSxV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