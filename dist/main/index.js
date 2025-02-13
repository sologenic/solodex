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
        if (props === null || props === void 0 ? void 0 : props.custom_tx_delivery_endpoint)
            this._custom_endpoint = props.custom_tx_delivery_endpoint;
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
                custom_endpoint: this._custom_endpoint,
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
                    const endpoint = this._custom_endpoint || utils_1.url;
                    Object.entries(msg.meta).map(async (entry) => {
                        if (entry[1] === true && !eventsEmitted.includes(entry[0])) {
                            if (entry[0] === types_1.States.SIGNED) {
                                const signedTX = await (0, axios_1.default)({
                                    method: "get",
                                    url: `${endpoint}/issuer/transactions/${msg.meta.identifier}`,
                                });
                                this._push_token = msg.meta.push_token;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsb0RBQWtDO0FBQ2xDLG1DQUFpRDtBQUNqRCxtQ0FBa0U7QUFHbEUsTUFBTSxTQUFTLEdBQUcsT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQVF6RSxNQUFNLE9BQVEsU0FBUSxnQkFBWTtJQU1oQyxZQUFZLEtBQW1CO1FBQzdCLEtBQUssRUFBRSxDQUFDO1FBTkYsaUJBQVksR0FBVyxNQUFPLENBQUM7UUFRckMsSUFBSSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVztZQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUU5RCxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBRWxELElBQUksS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLDJCQUEyQjtZQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLDJCQUEyQixDQUFDO0lBQzlELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFhO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTTtRQUNWLElBQUk7WUFDRixNQUFNLE9BQU8sR0FBRztnQkFDZCxlQUFlLEVBQUUsYUFBYTtnQkFDOUIsZUFBZSxFQUFFLFFBQVE7YUFDMUIsQ0FBQztZQUVGLE9BQU8sTUFBTSxJQUFJLENBQUMsZUFB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