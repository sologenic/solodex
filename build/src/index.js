"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const events_1 = __importDefault(require("events"));
const index_1 = require("./utils/index");
const index_2 = require("./types/index");
class SOLODEX extends events_1.default {
    constructor(props) {
        super();
        this._sign_expiry = 600000;
        if (props === null || props === void 0 ? void 0 : props.sign_expiry)
            this._sign_expiry = this._sign_expiry;
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            const tx_json = {
                TransactionType: "NicknameSet",
                TransactionKind: "SignIn",
            };
            return yield this.signTransaction(tx_json);
        });
    }
    setPushToken(token) {
        this._push_token = token;
    }
    signTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield (0, index_1.getConnectionRefs)(tx, {
                    expiry: this._sign_expiry,
                    pushToken: this._push_token,
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
                throw {
                    thrower: e.thrower || "sign",
                    error: e,
                };
            }
        });
    }
    _monitorConnection(connection) {
        return __awaiter(this, void 0, void 0, function* () {
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
                connectionWS.addEventListener("message", (message) => __awaiter(this, void 0, void 0, function* () {
                    if (message.data === "pong")
                        return;
                    const msg = JSON.parse(message.data);
                    if (msg.meta.hasOwnProperty("identifier")) {
                        Object.entries(msg.meta).map((entry) => __awaiter(this, void 0, void 0, function* () {
                            if (entry[1] === true && !eventsEmitted.includes(entry[0])) {
                                if (entry[0] === index_2.States.SIGNED) {
                                    const signedTX = yield (0, axios_1.default)({
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
                        }));
                    }
                }));
            }
            catch (e) {
                throw {
                    thrower: e.thrower || "monitorConnection",
                    error: e,
                };
            }
        });
    }
}
exports.default = SOLODEX;
