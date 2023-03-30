"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionRefs = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const getConnectionRefs = async (tx, options) => {
    try {
        const url = "https://api.sologenic.org/api/v1";
        const axiosResponse = await axios_1.default.post(url + "/issuer/transactions", {
            tx_json: tx,
            options: Object.assign({ expires_at: (0, dayjs_1.default)().add(options.expiry, "s").toISOString(), submit: false }, (options.pushToken ? { push_token: options.pushToken } : {})),
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (axiosResponse.status !== 200)
            throw {
                thrower: "getConnectionRefs",
                error: axiosResponse,
            };
        axiosResponse.data.refs.deeplink = `https://solodex.page.link/?link=${axiosResponse.data.refs.deeplink}&apn=com.sologenicwallet&isi=1497396455&ibi=org.reactjs.native.example.SologenicWallet`;
        return axiosResponse.data;
    }
    catch (e) {
        console.log(e);
        throw {
            thrower: "getConnectionRefs",
            error: e,
        };
    }
};
exports.getConnectionRefs = getConnectionRefs;
