"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionRefs = void 0;
const axios_1 = __importStar(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const getConnectionRefs = async (tx, options) => {
    try {
        const url = "https://api.sologenic.org/api/v1";
        console.log(axios_1.post, axios_1.default);
        const axiosResponse = await (0, axios_1.post)(url + "/issuer/transactions", {
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
