"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const events_1 = __importDefault(require("events"));
const utils_1 = require("./utils");
const types_1 = require("./types");
const Websocket = typeof window === "object" ? WebSocket : require("ws");
class SOLODEX extends events_1.default {
    constructor(props) {
        super();
        this._sign_expiry = 600000;
        if (props === null || props === void 0 ? void 0 : props.sign_expiry)
            this._sign_expiry = props.sign_expiry;
        if (props === null || props === void 0 ? void 0 : props.api_key)
            this._api_key = props.api_key;
    }
    set token(push_token) {
        this._push_token = push_token;
    }
    get token() {
        return this._push_token;
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
            const connection = await (0, utils_1.getConnectionRefs)(tx, {
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
                            if (entry[0] === types_1.States.SIGNED) {
                                const signedTX = await (0, axios_1.default)({
                                    method: "get",
                                    url: `${utils_1.url}/issuer/transactions/${msg.meta.identifier}`,
                                });
                                console.log("Message ", msg);
                                // this._push_token = msg.meta.push_token;
                                this.setPushToken(msg.meta.push_token);
                                this.emit(types_1.States.SIGNED, msg.meta.identifier, {
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
                            if ([types_1.States.SIGNED, types_1.States.CANCELLED, types_1.States.EXPIRED].includes(entry[0])) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0RBQWtDO0FBQ2xDLG1DQUFpRDtBQUNqRCxtQ0FBK0U7QUFFL0UsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQU96RSxNQUFNLE9BQVEsU0FBUSxnQkFBWTtJQUtoQyxZQUFZLEtBQW1CO1FBQzdCLEtBQUssRUFBRSxDQUFDO1FBTEYsaUJBQVksR0FBVyxNQUFPLENBQUM7UUFPckMsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVztZQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUU5RCxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxVQUFrQjtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBYTtRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU07UUFDVixJQUFJO1lBQ0YsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsZUFBZSxFQUFFLGFBQWE7Z0JBQzlCLGVBQWUsRUFBRSxRQUFRO2FBQzFCLENBQUM7WUFFRixPQUFPLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1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