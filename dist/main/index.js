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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0RBQWtDO0FBQ2xDLG1DQUFpRDtBQUNqRCxtQ0FBK0U7QUFFL0UsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQU96RSxNQUFNLE9BQVEsU0FBUSxnQkFBWTtJQUtoQyxZQUFZLEtBQW1CO1FBQzdCLEtBQUssRUFBRSxDQUFDO1FBTEYsaUJBQVksR0FBVyxNQUFPLENBQUM7UUFPckMsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVztZQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUU5RCxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQ3BELENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxVQUFrQjtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxZQUFZLENBQUMsS0FBYTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNWLElBQUk7WUFDRixNQUFNLE9BQU8sR0FBRztnQkFDZCxlQUFlLEVBQUUsYUFBYTtnQkFDOUIsZUFBZSxFQUFFLFFBQVE7YUFDMUIsQ0FBQztZ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