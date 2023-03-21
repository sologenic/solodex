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
exports.getConnectionRefs = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const getConnectionRefs = (tx, options) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.sologenic.org/api/v1/issuer/transactions";
    const axiosResponse = yield (0, axios_1.default)({
        url,
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            tx_json: tx,
            options: Object.assign({ expires_at: (0, dayjs_1.default)().add(options.expiry, "s").toISOString(), submit: false }, (options.pushToken ? { push_token: options.pushToken } : {})),
        }),
    });
    if (axiosResponse.status !== 200)
        throw {
            thrower: "getConnectionRefs",
            error: axiosResponse,
        };
    axiosResponse.data.refs.deeplink = `https://solodex.page.link/?link=${axiosResponse.data.refs.deeplink}&apn=com.sologenicwallet&isi=1497396455&ibi=org.reactjs.native.example.SologenicWallet`;
    return axiosResponse.data;
});
exports.getConnectionRefs = getConnectionRefs;
